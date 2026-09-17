I read a lot of web novels. Not literary fiction, the long serialized kind: power-fantasy stories where the protagonist keeps winning, and "infinite flow" stories where characters get dropped into one deadly instance after another, each with its own rules, and the main plot slowly surfaces between them. A good one runs a hundred chapters or more and never lets the pacing sag.

That's exactly what an LLM is bad at. Ask a model to "write chapter 12" and it will happily write something. It won't remember that the protagonist lost her left hand in chapter 7, it will wrap up the instance too early because it feels like an ending, it will invent a magic system that contradicts chapter 3, and it will end every chapter with a little moral summary. The prose is fine. The story drifts.

So I built DogBlood, a novel generator where the LLM never gets to decide where the story goes. A code-driven Director decides what phase the plot is in, a Planner turns that into concrete beats, a Writer writes the prose, and an Editor rejects the draft if it broke the rules. The whole thing runs as a LangGraph on a small Express server, with Supabase holding the story's memory. I built it solo over about ten days in December 2025, and it's live at dogblood-novel.dogblood-novel.workers.dev.

![DogBlood generation graph: a code-driven Director state machine emits a phase and chapter function, a Planner LLM turns it into a chapter goal, three story beats, and a hook, a Writer LLM produces the chapter plus memory and character deltas, a Polish pass cleans the prose, and an Editor LLM either passes the chapter or sends it back to the Writer with required fixes. Supabase stores novels, chapters, characters, memories, and dungeons](/img/blogs/dogblood-agent-graph.svg)

# 1. Why This Topic Matters

Long-form generation is a control problem, not a prompt problem. A single prompt with "be consistent and keep the pacing tight" fails in the same ways every time:

- **Pacing collapses.** The model resolves tension as soon as it can, because a resolved scene reads as complete.
- **It forgets.** Anything outside the context window is gone. Anything inside it competes with everything else.
- **It drifts.** Each chapter is generated from the previous one, so small deviations compound. By chapter 20 the genre has changed.
- **It sounds like AI.** The "it's not X, it's Y" construction, chapter-ending summaries, the same three sentence structures.

Infinite-flow stories make this worse on purpose. Every instance is a self-contained mini-story with setup, investigation, a twist, a climax, and a resolution, and then the characters return to the hub world where the main plot moves one notch. That's a structure. If you don't enforce it from outside the model, you don't get it.

# 2. The Core Idea (Mental Model)

Split "write the next chapter" into jobs with different amounts of freedom, and give the LLM only the jobs where creativity helps:

| Stage | Who | Decides | Not allowed to |
|---|---|---|---|
| **Director** | Code | Which phase we're in, what this chapter must accomplish, how intense it should be | Write anything |
| **Planner** | LLM | One-sentence chapter goal, three story beats, a closing hook | Write dialogue, add items or rules, change settings, spoil future instances |
| **Writer** | LLM | The prose, plus deltas: new memories, new clues, resolved clues, character updates | Repeat the previous chapter, break the outline |
| **Polish** | LLM | Sentence-level flow and sensory detail | Add, remove, or change any event |
| **Editor** | LLM | PASS or REWRITE_REQUIRED, with a list of required fixes | Rewrite it itself |

The Director being code is the whole trick. It's a state machine, not a model. It can't be talked into ending the instance early because it doesn't read the chapter. The LLM stages get freedom inside a frame, and the frame is deterministic.

The pipeline is a LangGraph `StateGraph`. The state is one typed object: static context like the novel's blueprint, tags, tone, and point of view, plus the rolling pieces: previous text, characters, memories, clues, the current `plotState`, and each stage's output. The graph is linear except for one conditional edge: if the Editor says rewrite, control goes back to the Writer with the critique attached.

```js
const shouldContinue = (state) =>
  state.critique?.status === "REWRITE_REQUIRED" ? "writer" : END;

new StateGraph(NovelGenerationState)
  .addNode("director", directorNode)
  .addNode("planner", plannerNode)
  .addNode("writer", writerNode)
  .addNode("editor", editorNode)
  .addEdge(START, "director")
  .addEdge("director", "planner")
  .addEdge("planner", "writer")
  .addEdge("writer", "editor")
  .addConditionalEdges("editor", shouldContinue);
```

# 3. How It Works in Practice

## The Director Is a State Machine

For infinite-flow novels, the Director tracks two things: a phase (`hub` or `dungeon`) and a sub-phase. The hub world walks through `intro → settling → conflict → pre_dungeon`, then hands off to a dungeon that walks through `setup → investigation → twist → climax → resolution`, then returns to the hub with the cycle counter incremented.

![Director state machine for infinite-flow novels: hub world sub-phases intro, settling, conflict, and pre-dungeon lead into a dungeon cycle of setup, investigation, twist, climax, and resolution, which returns to the hub and increments the cycle number. When the chapter index is within five of the target ending, the machine jumps to a finale phase](/img/blogs/dogblood-director-state-machine.svg)

Each transition returns a `chapter_function`, an `intensity`, and `notes` that read like instructions to a screenwriter (the real strings are in Chinese; translated here):

```js
if (subPhase === "settling") {
  return {
    phase: "hub",
    sub_phase: "conflict",
    chapter_function: [
      "friction between the protagonist and hub-world characters",
      "show the protagonist's wits or grasp of the rules"
    ],
    intensity: "medium",
    notes: "do not reveal the real enemy yet, only a minor antagonist",
  };
}
```

"Don't reveal the real enemy yet, only a minor antagonist." That constraint doesn't come from the model's judgment. It comes from where we are in the cycle.

For non-instance genres, the Director uses a progress bar from 0 to 100 instead of sub-phases: `setup` under 15, `investigation` to 75, `climax` to 100, then `resolution` and a `rest` chapter before the next arc. Tags overlay extra directives: an angst tag makes the climax a painful choice instead of a shared victory, a secret-identity tag adds a "nearly gets unmasked" thread to every non-rest chapter.

Both versions have a finale override. If the novel has a target ending chapter and we're within a few chapters of it, the machine ignores its normal cycle and switches to `finale`, where the note is "no new threads, only convergence."

## The Planner Turns Function Into Beats

The Planner is the first LLM call. It gets the Director's chapter function, the world blueprint, the current dungeon and its rules, a summary of the last chapter, and the memory list. It returns three things and is told, in the prompt, that it may only do three things:

```text
chapter_goal  one sentence, not vague
story_beats   three events in order
hook          the chapter-ending cliffhanger
```

Everything else is forbidden: no dialogue, no new items or rules, no touching existing settings, no spoiling future instances.

When the Director says a new dungeon starts, the Planner also builds it. A theme is picked from a pool of a few hundred instance premises grouped by archetype (modern urban horror, Chinese folk horror, western and cosmic horror, sci-fi, survival and rule-based, and so on), filtered by the novel's tags and by a `used_themes` list so a novel never repeats one. A separate call turns the theme into a full dungeon design: background, mechanics, core rules or missions, entities, possible endings. That design is written to a `dungeons` table and pinned into the plot state so every chapter inside the instance sees the same rules.

Progress inside a dungeon isn't purely scripted either. The Planner counts how many clues have been marked resolved and can pull the progress bar forward, so an instance where the protagonist is solving things fast reaches its climax sooner.

## The Writer Writes, and Reports What Changed

The Writer prompt is assembled from about ten pieces: the anti-cliché rules, the style line (genre, tags, tone, point of view), the blueprint, the Director's directive, the Planner's outline, any rewrite instructions from a previous Editor pass, an explicit "do not repeat the previous chapter's ending" line, and then context: memories, open clues, the character list with current statuses, and the last 2,000 characters of the previous chapter.

It's asked for JSON, not prose:

```json
{
  "content": "...",
  "new_memories": [],
  "new_clues": [],
  "resolved_clues": [],
  "character_updates": []
}
```

Those four arrays are how the story remembers itself. The frontend writes them to Supabase in parallel with the chapter: memories become rows, character updates patch the `characters` table, clues update the plot state. The next chapter's Planner and Writer read them back. There's no separate "memory agent." The Writer is the one who knows what changed, so it reports it.

The primary model is Gemini 2.0 Flash in JSON mode. If Gemini refuses the request, which happens with dark or violent content even at the most permissive safety settings, the Writer falls back to DeepSeek through OpenRouter. An earlier version fell back to an uncensored 72B model for the same reason. Then a Polish pass rewrites the draft for flow and sensory detail with a strict "change no events" instruction.

## The Editor Is a Gate

The Editor gets the draft, the plan, the Director's directive, and the previous chapter, and checks five things: did it follow the beats, does it continue from the last chapter without repeating it, did it add rules or break character, did it accomplish the chapter function, and does it read like AI. It returns either `PASS` or:

```json
{
  "status": "REWRITE_REQUIRED",
  "reason": "...",
  "required_fixes": ["...", "..."]
}
```

On rewrite, the graph routes back to the Writer, and the Writer's prompt now includes the fixes under a "your last draft was rejected" header. The Editor never edits. It only says no.

## Anti-Cliché Rules Are Their Own Artifact

A block of negative constraints is prepended to every Planner and Writer call. It's versioned in the code like any other module, because it changed more often than anything else. Some of it is genre isolation: no cultivation terms in a western fantasy, no smartphones in a palace drama, no protagonist who works as an AI engineer unless the setting is sci-fi. Some of it is voice: no "it's not X, it's Y", no "it is worth mentioning that", no chapter-ending summary or moral. And one rule specific to the genre: the hub world is a brutal arena, not a computer system, and instances are random and lethal.

I didn't expect a list of banned phrases to matter this much. It was the single biggest improvement in how the output read.

## The Reader Keeps Generation Ahead of the User

The frontend is a phone-first reader. Chapters render as CSS columns and you swipe or tap to turn pages. When the reader is within five chapters of the last generated one and they own the novel, the app calls the graph endpoint in the background to generate the next chapter, so the buffer stays ahead. If generation fails, a `generationError` flag stops the loop and shows a retry button, because the first version silently locked up at chapter 3 when one call failed.

There's also text-to-speech with automatic page turning, translation, a Gemini vs DeepSeek toggle, a target ending chapter setting that feeds the Director's finale override, and an editable wiki of characters and memories so the reader can correct the story's state by hand.

A second mode, interactive, runs a different pipeline: a branch designer proposes three divergent directions after each segment and the reader picks one. Same Writer, different Director.

## How It Got Here

The project moved fast, and the history shows the architecture being discovered rather than planned:

- **Dec 2**: one prompt, called from the browser with the Gemini SDK. Worked for three chapters.
- **Dec 3**: split into Director, Planner, Writer, Editor. Still in the frontend.
- **Dec 4**: moved generation to an Express server, mostly to stop shipping API keys to the browser.
- **Dec 5 to 8**: infinite-flow support: the hub and dungeon state machine, the theme pool, dungeon design, rules.
- **Dec 9**: interactive mode.
- **Dec 12**: rewrote the pipeline as a LangGraph with a typed state and a checkpointer.

Deployment is split: the React app is static assets on Cloudflare Workers, the Express server runs on Railway, and a Capacitor wrapper builds the iOS version.

# 4. Tradeoffs and Design Decisions

**Why is the Director code and not an LLM?**
- **Pro**: It can't be persuaded. Pacing is enforced, not requested.
- **Pro**: Free and instant. No tokens, no latency, no JSON parsing.
- **Con**: Every genre needs its own state machine. Adding a new structure means writing code, not a prompt.

The first version was a single prompt that had to judge pacing on its own, and it resolved tension as fast as it could. Moving the phase decision into code was the fix, and it never went back.

**Why LangGraph instead of calling four functions in order?**
- **Pro**: The state is one declared object, so every node reads and writes the same shape. Before the rewrite, plot state was threaded through function arguments and got lost twice.
- **Pro**: The Editor loop is one conditional edge instead of a while loop with manual bookkeeping.
- **Pro**: The checkpointer keys runs by thread id, which is what makes "user adjusts, then regenerate" possible later.
- **Con**: It's another dependency and another mental model. For a four-node pipeline the benefit is real but not huge.

**Why does the Writer report memory deltas instead of a separate memory agent?**
One fewer LLM call per chapter, and the Writer is the only stage that actually knows what it wrote. The cost is that a Writer that hallucinates a memory writes a bad row, and nothing checks it.

**Why a separate Polish pass?**
Asking one call to both follow a strict beat outline and write beautifully produced stiff prose. Splitting "get the events right" from "make it read well" improved both. It costs one more call and a little risk that Polish changes an event despite being told not to.

**Why Gemini Flash as the primary model?**
Speed and price. A chapter is four to five LLM calls, and the reader expects the next one before they finish this one. DeepSeek writes better Chinese for some tones, which is why it's a toggle, but it's slower.

**Why a fixed memory window instead of retrieval?**
The Planner sees the first five memories and the last thirty. Primacy and recency, no embeddings. The `memories` table has a `type` column reserved for RAG, but for a hundred chapters the window was enough and retrieval was one more thing to debug.

# 5. Failure Cases and Common Mistakes

**No explicit rewrite cap.** The Editor loop has no counter. LangGraph's default recursion limit of 25 steps is the only thing stopping it, which works out to roughly ten rewrites before the run errors. Each rewrite is two more LLM calls. A stubborn Editor on a chapter the Writer can't fix burns a lot of tokens before failing.

**The Editor fails open.** If the Editor call throws or returns unparseable JSON, the node returns `PASS`. That's the right call for availability and the wrong call for quality. A bad draft on a bad day ships.

**JSON parsing is best-effort.** The parser strips code fences and slices from the first `{` to the last `}`. When a model puts a stray brace in the prose, the chapter is lost and the frontend sees null.

**The Director ignores the chapter index for infinite-flow novels.** The node passes a placeholder index and a default total of 200, so the finale override only fires through the general-genre path. The state machine still cycles correctly; it just doesn't know when the book is supposed to end unless the frontend tells it.

**Memories grow forever.** Every chapter adds rows and nothing summarizes or retires them. The window hides this for now. At several hundred chapters the first-five-plus-last-thirty rule will be dropping the middle of the story.

**Row level security is demo-grade.** The schema shipped with allow-all policies for a single hard-coded user, then grew an auth trigger. Anyone with the anon key and a novel id could read chapters they don't own. Fine for a personal project, not for anything else.

**Safety filters are load-bearing.** Horror and angst content trips Gemini's filters even at BLOCK_ONLY_HIGH. The fallback chain exists because of it, and the output quality changes when the fallback fires.

**The reader used to lock up at chapter 3.** The prefetch used a ref as a mutex and never released it on error. One failed call froze generation forever with no UI. That bug is why the error state and retry button exist.

# 6. What I Learned Personally

I started this thinking the interesting problem was the prompts. It was the state machine. Once the Director existed, prompt changes became tuning. Before it, they were firefighting.

I underestimated how much a "banned phrases" list would do. Genre isolation rules and a list of AI-isms moved the output from "obviously generated" to "readable" more than any model change.

Splitting write and polish felt wasteful. It wasn't. Constraints and style fight each other in one prompt.

I also learned to be suspicious of my own Editor. An LLM judge that fails open and has no retry budget isn't really a gate, it's a suggestion. The next version needs a counter and a fail-closed default.

And the thing that surprised me most: ten days from one prompt to a typed graph with a state machine, a memory system, three genres, and an interactive mode. The history is 64 commits. Most of the architecture was discovered by watching what went wrong in the generated chapters.

# 7. Key Takeaways

- **Pacing has to live outside the model.** A code-driven state machine for plot phase is the single most important piece. The LLM fills in, it doesn't steer.
- **Give each stage a narrow job and a list of things it may not do.** The Planner can't write dialogue. The Polish pass can't change events. The Editor can't rewrite.
- **Let the Writer report deltas.** Memories, clues, and character updates as structured output from the same call that wrote the chapter. No separate memory agent.
- **Negative constraints are a first-class artifact.** Version them, iterate on them, expect them to matter more than model choice.
- **Split "correct" from "beautiful."** One pass for beats, one pass for prose.
- **An Editor without a retry budget and a fail-closed default is decoration.** Build the loop cap in from the start.
- **Prefetch and fail loudly.** Keep generation ahead of the reader, and never let a background failure silently stop the loop.

# Frequently Asked Questions

### Why not just use a long context window and one prompt?
Context size doesn't fix pacing or drift. The model still resolves tension early and still compounds small deviations chapter to chapter. A large window makes forgetting rarer; it doesn't create structure.

### Is the Director really not an LLM?
Correct. It's a JavaScript state machine that returns the next phase, the chapter's required function, and an intensity. It never sees the chapter text. That's why it can't be argued out of the plan.

### How does the story remember what happened?
The Writer returns structured deltas alongside the chapter: new memories, new and resolved clues, and character status updates. Those are written to Supabase and fed to the next chapter's Planner and Writer as context, along with the last 2,000 characters of prose.

### What happens when the Editor rejects a chapter?
The graph routes back to the Writer with the Editor's required fixes injected into the prompt under a rejection header. The Writer produces a new draft and the Editor checks again. There's no explicit cap, so LangGraph's recursion limit is the backstop.

### Why both Gemini and DeepSeek?
Gemini Flash is fast and cheap, which matters when a chapter is five calls and the reader is waiting. DeepSeek writes some tones better in Chinese and doesn't refuse dark content, so it's both a user toggle and the fallback when Gemini's safety filter blocks a request.

---

**Tech Stack:** `LangGraph` · `Node.js` · `Express` · `Gemini 2.0 Flash` · `DeepSeek V3 via OpenRouter` · `Supabase` · `React 19` · `Vite` · `Tailwind CSS` · `Cloudflare Workers` · `Railway` · `Capacitor`
