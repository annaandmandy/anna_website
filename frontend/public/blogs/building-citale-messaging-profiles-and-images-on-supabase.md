Citale is a social platform for discovering things to do in Boston, live in public beta at citale.vercel.app. Stella, the founder, had already built the first version with a few others over the summer before I joined. Nine people touched the repo over about a year. I was one of the two most active contributors, with roughly 200 commits between October 2024 and April 2025.

It was also the first website I ever worked on.

I joined in my first semester in the US. Stella was in the same CS660 database course as me, and she was looking for people to help build the product. I said yes without really knowing what a Next.js app was. This was late 2024, when AI coding tools were just starting to be useful. We leaned on them, but most of what we learned came from breaking things and figuring out why. That project is where my full-stack and developer experience actually starts.

That same semester, Stella got Citale accepted into BU Spark! Launch Lab. It's the university's internal program for teams that already have a working prototype and want to take it further, closer to an incubator than a class. Teams work in weekly sprints with a mentor and present to the Spark! Tech Council twice a semester. We did one semester on the volunteer track, which came with a small stipend for equipment. What it really gave us was structure: a cadence, someone asking hard questions every week, and a reason to ship instead of polish.

This post isn't a tour of the whole product. It's about the three parts I owned end to end: direct messaging, profiles and the follow system, and the image pipeline from upload to CDN. I also picked up filtering, Google Maps previews on posts, and the PostHog integration along the way. Likes, notifications, and the Talebot recommendation bot were built by teammates, so I only mention them where they touch my code.

![Citale architecture: a Next.js 14 App Router app on Vercel talks directly to Supabase Auth, Postgres, and Storage from the browser, with a Cloudflare Worker caching Storage images, PostHog for analytics, and Google Maps embeds on posts. The three areas I owned, messaging, profiles and follows, and the image pipeline, are highlighted](/img/blogs/citale-architecture.svg)

# 1. Why This Topic Matters

Most "build a social app" tutorials stop at auth and a feed. The parts that actually take time are the ones after that: how two people's messages become one conversation, how a follow relationship gets counted correctly from both sides, and what happens to a 6 MB phone photo between the file picker and a 25 pixel avatar in a follower list.

Citale runs entirely on Supabase from the browser. There is no custom API server. Every feature is a Postgres table, a query from the client, and some React state. That makes it fast to ship and easy to underestimate. The bugs don't show up in the happy path. They show up when two components disagree about the same data, when a poll runs in three tabs at once, or when a user deletes a post and the images stay behind in storage.

# 2. The Core Idea (Mental Model)

The stack is Next.js 14 with the App Router, deployed on Vercel, and Supabase for everything on the backend:

- **Supabase Auth** for sign-up, login, password reset, and the session cookie
- **Postgres** for posts, drafts, profiles, relationships, chats, likes, favorites, and comments
- **Supabase Storage** with separate buckets for posts, drafts, and profile pictures
- **A Cloudflare Worker** in front of Storage so images are cached at the edge

The mental model I ended up with: **the browser is the backend client**. The Supabase JS client runs in React components, row level security decides what each user can read and write, and there is no layer in between to hide mistakes. If a query is wrong, the UI is wrong.

That also means every feature has the same three questions:

1. What table and what columns represent this?
2. How does the client learn that the data changed?
3. What happens if two things change it at the same time?

Messaging, follows, and images each answer those questions differently, which is why they're the three I want to walk through.

# 3. How It Works in Practice

## Direct Messaging

The `chats` table is deliberately flat:

```text
chats
  sender_id    uuid
  receiver_id  uuid
  content      text
  sent_at      timestamp
  is_read      boolean
```

There's no `conversations` table. A conversation between two users is just every row where they're on either side. Loading a chat runs two queries, one for messages I sent and one for messages I received, then merges and sorts them by time:

```ts
const combined = [...(sentData || []), ...(receivedData || [])];
combined.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
```

Opening a chat also marks everything from that sender as read in the same fetch, so the unread badge clears the moment you look at the conversation.

**How does the client learn about new messages?** Polling. The chat page refetches every 2 seconds, and the toolbar checks for unread messages on its own interval to show a red dot. To stop the list from re-rendering on every poll when nothing changed, I compare the new result against the previous one before touching state:

```ts
if (JSON.stringify(combined) !== JSON.stringify(previousMessagesRef.current)) {
  setMessages(combined);
  previousMessagesRef.current = combined;
}
```

Sending a message inserts the row and appends it to local state immediately, so the sender never waits for the next poll.

The inbox list is derived, not stored. It pulls every message involving the current user, reduces them to the latest message per other person, then fetches those people's profiles and overlays an unread count per sender from a second query. That's a lot of work for an inbox, and I'll come back to it in the tradeoffs.

One more detail that only mattered on phones: the chat layout uses `h-[100dvh]` instead of `h-screen`, with the header and input marked `shrink-0`. Mobile browsers change the viewport height when the address bar hides, and `100vh` leaves the input pinned behind the keyboard. Several of my commits are just that fight.

## Profiles and the Follow System

A follow is one row in `relationships`:

```text
relationships
  user_id      uuid   -- the person doing the following
  follower_id  uuid   -- the person being followed
```

The column names are a trap I set for myself. `follower_id` is not the follower. It's the account being followed, and `user_id` is the one who clicked follow. Every query that touches this table has a comment next to it explaining which side is which, because I got it backwards more than once.

Counts are derived on read:

- Followers of a profile: `relationships` where `follower_id` equals the profile's id
- Following: `relationships` where `user_id` equals the profile's id

Both queries re-run whenever the local `following` flag flips, so the numbers update right after a follow or unfollow without a page reload.

The follower and following popups fetch the relationship rows first, then load each profile individually. Because those profile fetches resolve in any order, the popup appends into state with a duplicate check:

```ts
setFollowerDetails(prev =>
  prev.some(u => u.id === userId) ? prev : [...prev, data]
);
```

Without that, opening and closing the popup quickly produced the same person twice. That's a small line, but it's the difference between a list that looks right and one that doesn't.

The profile page itself has four tabs: posts, drafts, liked, and favorites. Drafts are only shown on your own profile. Posts and drafts live in separate tables and separate storage buckets, which made "publish a draft" and "delete a draft" much simpler than a status column would have.

## The Image Pipeline

Images are where most of the real engineering in my part of Citale lives. There are two paths: avatars and post media.

**Avatars.** On the edit profile page, the user picks a file and gets a cropper. When they save, the cropped canvas is rendered at exactly 128 by 128 and uploaded as the "normal" avatar. In parallel, the original file goes through `browser-image-compression` with a 40 pixel max dimension and is uploaded as a "compressed" version:

```ts
const croppedCanvas = cropper.getCroppedCanvas({ width: 128, height: 128 });
croppedCanvas.toBlob(async (blob) => {
  await uploadPicToStorage('normal', file);
});

const compressed = await imageCompression(file, { maxWidthOrHeight: 40, useWebWorker: true });
await uploadPicToStorage('compressed', compressed);
```

The profile row stores both paths as `avatar_url` and `avatar_url_small`. Post headers, comments, and the toolbar use the 128 version. Follower lists, inbox previews, and anywhere with a 25 pixel circle use the small one. Before this, every avatar in a follower list was loading a full-resolution phone photo.

**Post media.** The posting form accepts multiple images or a single video. Images show in a preview grid where the user can drag to reorder, using `react-dnd` with a multi-backend so it works with both a mouse and a touch screen. Each image can be opened in a cropper, and the cropped result replaces the original in the preview as a data URL. Only on submit do the files get uploaded to Supabase Storage under `images/` or `videos/` with a generated file name.

**Delete.** Deleting a post removes the media from the bucket first, then deletes the row. If the storage removal fails, the function stops and the post stays. I chose that order because an orphaned row is visible and fixable, while orphaned files in a bucket are invisible and cost money forever.

**CDN.** Originally every image URL pointed straight at Supabase Storage. A teammate stood up a Cloudflare Worker that caches Storage objects at the edge, and my job was the app side: every image `src` across cards, post media, avatars, and profile pages moved from the Storage URL to a `NEXT_PUBLIC_IMAGE_CDN` environment variable, and the Worker hostname went into `remotePatterns` in `next.config.mjs` so `next/image` would accept it. That was a five-file change, but it meant the whole app could switch CDNs by changing one variable.

## Smaller Pieces

- **Filtering.** The first version of category, location, and price filtering was mine: a filter results route, the filter component, and the button in the header. Teammates reworked it later.
- **Google Maps on posts.** A post can carry a map search term, which renders as a Google Maps embed inside the post view.
- **PostHog.** Page views with the App Router don't fire on their own, so I added a `PostHogPageView` component that captures on every pathname or search param change, wrapped in `Suspense` so `useSearchParams` doesn't push the whole app into client-side rendering.

# 4. Tradeoffs and Design Decisions

**Why polling instead of Supabase Realtime for chat?**
- **Pro**: Zero setup. No publication config, no channel lifecycle, no reconnect logic. It shipped in a weekend.
- **Pro**: Every poll is a normal query under row level security, so there's no separate auth story.
- **Con**: A 2 second interval per open chat plus a toolbar interval per tab is a lot of requests for a small beta.
- **Con**: Latency is worst-case 2 seconds, and it's the same whether anyone is typing or not.

Realtime was the obvious next step, and the likes feature built by a teammate already used `postgres_changes` subscriptions. I kept polling because it was predictable, and the traffic in beta never made it hurt.

**Why two queries for a conversation instead of one `or` filter?**
Supabase's query builder supports `or`, but a combined filter on two column pairs got hard to read, and the two-query version made the "mark as read" step obvious. The cost is one extra round trip per poll.

**Why derive the inbox instead of storing a conversations table?**
- **Pro**: No schema for conversations, no risk of the summary drifting from the messages.
- **Con**: The inbox does an N+1 fetch for profiles and an extra query for unread counts every time it loads.

For a beta with a few dozen users, correctness won. At scale it should be a view or a table maintained by a trigger.

**Why store two avatar sizes instead of resizing on the fly?**
The Cloudflare Worker caches objects; it doesn't transform them. Generating a 40 pixel version at upload time cost one extra request per profile edit and saved every list view from downloading a full photo.

**Why crop client-side to a data URL?**
It keeps the posting flow entirely in the browser until submit, so a user can crop, reorder, and change their mind with no orphaned uploads. The tradeoff is memory: a few large data URLs in React state is fine, a dozen is not.

# 5. Failure Cases and Common Mistakes

**Mark-as-read runs on every poll.** The chat page updates `is_read` in the same function that fetches messages, so every 2 seconds it issues an update even when nothing is unread. It's harmless in Postgres, but it's wasted writes and it made the logs noisy.

**Follow counts refetch on a boolean.** The counts re-run whenever the `following` flag changes, which is correct for the current user's action but doesn't notice when someone else follows the profile you're looking at. You'd need a refresh or a subscription to see it.

**The follower popup is N+1.** Twenty followers is twenty profile queries. A single `select ... in (...)` or a join through the Supabase client would have been one.

**Deleting media then failing the row delete.** My order protects against orphaned files, but if the storage removal succeeds and the row delete fails, the post exists with broken images. The proper fix is a database function that does both, or a cleanup job.

**Cropping loses the original.** The cropped data URL replaces the original in state, so there's no undo. A user who crops badly has to re-pick the file.

**Mobile viewport height.** The chat input disappearing behind the keyboard took a surprising number of commits: `h-screen` to `h-[100dvh]`, `overflow-hidden` on the container, `shrink-0` on the header and input. It looked fine in desktop devtools every time.

**Column naming.** `follower_id` meaning "the one being followed" is the kind of thing that seems fine when you write it and costs every future reader a minute. If I did it again the columns would be `follower_id` and `following_id` and mean what they say.

# 6. What I Learned Personally

I came into Citale thinking backend work meant writing an API. This project had no API layer and still had every backend problem: consistency, freshness, N+1 queries, orphaned data, and cost. Supabase just moves those problems into the component that runs the query.

I underestimated how much of a "messaging feature" is layout. The data model for chat took an afternoon. Making the input stay above the keyboard on iOS took days across three separate PRs.

Two avatar sizes felt like premature optimization when I built it. Then I opened a follower list on a phone over cellular and watched twenty full-resolution photos load one by one. Small images in small places is not an optimization, it's the baseline.

Merging fourteen of my own PRs into a repo with nine contributors taught me to keep branches small and named after the feature. Looking back at the history, the branch names alone tell you what I built.

The weekly sprint rhythm from Launch Lab mattered more than any single feature. Knowing I had to show something working every week is why the chat shipped with polling instead of waiting for a perfect Realtime setup, and why most of my commits are small. For a first project, that habit was worth more than the code.

# 7. Key Takeaways

- **Supabase from the browser is a real backend.** Row level security is your API layer. Treat every client query as production code.
- **Polling is a legitimate first version** for chat. Ship it, measure it, then move to Realtime when the request volume actually matters.
- **Derive counts and summaries on read until they hurt.** Correctness first, then a trigger or a view.
- **Name relationship columns by role, not by table.** `follower_id` and `following_id`, never `user_id` and `follower_id`.
- **Generate the small image at upload time.** A CDN caches bytes, it doesn't shrink them.
- **Delete files before rows, and know which failure you're choosing.** Orphaned files are invisible; orphaned rows are at least visible.
- **Test mobile layout on a phone.** `100vh` lies once the keyboard opens.

# Frequently Asked Questions

### Why didn't Citale use a separate backend server?
Supabase gave us Auth, Postgres, Storage, and Realtime with a JavaScript client that runs in the browser, and row level security enforces who can read and write each row. For a student team shipping a beta, skipping the API layer meant every feature was one table and one query away.

### How does the chat know when a new message arrives?
The chat page polls Supabase every 2 seconds and compares the result to the previous one before updating state. The sender's own message is appended locally right after the insert, so only the receiver waits for a poll. Supabase Realtime would remove the polling entirely and was the planned next step.

### How are follows stored?
One row per follow in a `relationships` table with two user ids. Follower and following counts are computed on read by counting rows on each side. There's no denormalized counter on the profile.

### Why store two sizes of every avatar?
The 128 pixel version is used in post headers and comments. The 40 pixel version is used in follower lists and inbox previews. Storing both at upload time means small UI never downloads a full-resolution photo, and the Cloudflare cache in front of Storage serves whichever one is requested.

### What would you change first for production?
Replace chat polling with a Realtime subscription, collapse the follower popup's N+1 into one query, and move "delete media then delete row" into a single database function so it can't half-succeed.

---

**Tech Stack:** `Next.js 14` · `TypeScript` · `Tailwind CSS` · `Supabase Auth` · `Supabase Postgres` · `Supabase Storage` · `Cloudflare Workers` · `react-cropper` · `browser-image-compression` · `react-dnd` · `Google Maps Embed` · `PostHog` · `Vercel`
