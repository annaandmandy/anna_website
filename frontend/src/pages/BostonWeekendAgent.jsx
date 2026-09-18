import React, { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../components/SEO";
import "../styles/boston-weekend-agent.css";

const REPORT_URL =
  "https://d2ugiuoady5eh5.cloudfront.net/reports/weekend_summary.json";
const FEEDBACK_API_URL = (
  import.meta.env.VITE_FEEDBACK_API_URL ||
  "https://nw4rup2tcj.execute-api.us-east-1.amazonaws.com"
).replace(/\/$/, "");
const FEEDBACK_VISITOR_KEY = "boston-weekend-feedback-visitor";

const getFeedbackVisitorId = () => {
  const existing = window.localStorage.getItem(FEEDBACK_VISITOR_KEY);
  if (existing) return existing;
  const randomPart = window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const visitorId = `visitor_${randomPart}`;
  window.localStorage.setItem(FEEDBACK_VISITOR_KEY, visitorId);
  return visitorId;
};

const activityDateLabel = (value) => {
  if (!value) return "Date to confirm";
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const activityTimeLabel = (value) => {
  if (!value) return "Time to confirm";
  const clock = String(value).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!clock) return value;
  const hour = Number(clock[1]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${clock[2]} ${suffix}`;
};

const activityCategoryLabel = (value) =>
  value && String(value).toLocaleLowerCase() !== "undefined"
    ? value
    : "Local event";

const priceSortValue = (activity) => {
  if (activity.price_type === "free") return 0;
  const match = String(activity.price || "").match(/\$\s*([\d.]+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const timeSortValue = (value) => {
  const match = String(value || "")
    .toLocaleLowerCase()
    .match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (!match) return 24 * 60;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  if (match[3] === "pm" && hour < 12) hour += 12;
  if (match[3] === "am" && hour === 12) hour = 0;
  return hour * 60 + minute;
};

const WeekendReport = () => {
  const [report, setReport] = useState(null);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityCity, setActivityCity] = useState("all");
  const [activityDate, setActivityDate] = useState("all");
  const [activityPrice, setActivityPrice] = useState("all");
  const [activitySort, setActivitySort] = useState("date-asc");
  const [activityFeedback, setActivityFeedback] = useState({});
  const [feedbackBusy, setFeedbackBusy] = useState([]);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(REPORT_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to fetch report. Status: ${response.status}`);
        }
        const payload = await response.json();
        if (!payload?.languages?.zh?.markdown || !payload?.languages?.en?.markdown) {
          throw new Error("Report response is missing a language version");
        }
        setReport(payload);
        setLastFetched(new Date());
        setError(null);
      } catch (fetchError) {
        console.error("Error fetching the weekend report:", fetchError);
        setError(
          "Bo cannot reach the latest map signal right now—please try again soon. 波波目前收不到最新地圖訊號，請稍後再回來看看。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
    const intervalId = setInterval(fetchReport, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [reloadKey]);

  useEffect(() => {
    if (!FEEDBACK_API_URL || !report?.activities?.length) return undefined;
    const controller = new AbortController();
    const loadFeedback = async () => {
      try {
        const response = await fetch(`${FEEDBACK_API_URL}/feedback/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_ids: report.activities.map((activity) => activity.event_id),
            visitor_id: getFeedbackVisitorId(),
          }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Feedback status ${response.status}`);
        const payload = await response.json();
        setActivityFeedback(payload.feedback || {});
        setFeedbackError("");
      } catch (feedbackFetchError) {
        if (feedbackFetchError.name !== "AbortError") {
          console.error("Error fetching activity feedback:", feedbackFetchError);
          setFeedbackError("Likes are temporarily unavailable.");
        }
      }
    };
    loadFeedback();
    return () => controller.abort();
  }, [report]);

  const toggleActivityLike = async (eventId) => {
    if (!FEEDBACK_API_URL || feedbackBusy.includes(eventId)) return;
    const previous = activityFeedback[eventId] || { likes: 0, liked: false };
    const optimistic = {
      likes: Math.max(0, previous.likes + (previous.liked ? -1 : 1)),
      liked: !previous.liked,
    };
    setFeedbackBusy((current) => [...current, eventId]);
    setActivityFeedback((current) => ({ ...current, [eventId]: optimistic }));
    setFeedbackError("");
    try {
      const response = await fetch(`${FEEDBACK_API_URL}/feedback/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          visitor_id: getFeedbackVisitorId(),
          action: previous.liked ? "unlike" : "like",
          request_id: window.crypto.randomUUID(),
        }),
      });
      if (!response.ok) throw new Error(`Feedback status ${response.status}`);
      const payload = await response.json();
      setActivityFeedback((current) => ({
        ...current,
        ...(payload.feedback || {}),
      }));
    } catch (feedbackUpdateError) {
      console.error("Error updating activity feedback:", feedbackUpdateError);
      setActivityFeedback((current) => ({ ...current, [eventId]: previous }));
      setFeedbackError("That Like did not save. Please try again.");
    } finally {
      setFeedbackBusy((current) => current.filter((value) => value !== eventId));
    }
  };

  const activeReport = report?.languages?.[language]?.markdown ?? "";
  const activities = report?.activities ?? [];
  const activityCities = useMemo(
    () =>
      [...new Set(activities.map((activity) => activity.city).filter(Boolean))].sort(
        (left, right) => left.localeCompare(right),
      ),
    [activities],
  );
  const activityDates = useMemo(
    () =>
      [...new Set(activities.map((activity) => activity.date).filter(Boolean))].sort(),
    [activities],
  );
  const visibleActivities = useMemo(() => {
    const query = activitySearch.trim().toLocaleLowerCase();
    const filtered = activities.filter((activity) => {
      const searchable = [
        activity.title,
        activity.description,
        activity.location,
        activity.city,
        activity.category,
        activity.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (activityCity === "all" || activity.city === activityCity) &&
        (activityDate === "all" || activity.date === activityDate) &&
        (activityPrice === "all" || activity.price_type === activityPrice)
      );
    });

    return [...filtered].sort((left, right) => {
      if (activitySort === "title-asc") {
        return left.title.localeCompare(right.title);
      }
      if (activitySort === "city-asc") {
        return String(left.city || left.location).localeCompare(
          String(right.city || right.location),
        );
      }
      if (activitySort === "price-asc") {
        return priceSortValue(left) - priceSortValue(right);
      }
      if (activitySort === "likes-desc") {
        return (
          (activityFeedback[right.event_id]?.likes || 0) -
          (activityFeedback[left.event_id]?.likes || 0)
        );
      }
      const dateOrder = String(left.date || "9999-12-31").localeCompare(
        String(right.date || "9999-12-31"),
      );
      if (dateOrder) return dateOrder;
      return timeSortValue(left.time) - timeSortValue(right.time);
    });
  }, [
    activities,
    activityCity,
    activityDate,
    activityPrice,
    activitySearch,
    activitySort,
    activityFeedback,
  ]);

  return (
    <main className="bobo-weekend-page">
      <SEO
        title="Boston Weekend Vibe - Hsiang Yu Huang"
        description="A bilingual, AI-assisted weekend letter with verified events, weather, and local ideas around Greater Boston."
        name="Boston Weekend Agent"
        type="article"
      />

      <section className="container bobo-weekend-shell">
        <header className="bobo-weekend-hero" data-aos="fade-down">
          <div className="bobo-hero-copy">
            <p className="bobo-eyebrow">BOSTON WEEKEND AGENT</p>
            <h1>Boston Weekend Vibe</h1>
            <p className="bobo-hero-subtitle">
              Bo&apos;s Bilingual Weekend Letter
            </p>
            <p className="bobo-hero-intro">
              Weather, events, and the small rhythms that make a Boston weekend
              feel local. Bo sends a planning edition on Thursday, then checks
              for changes again on Friday morning.
            </p>
            <div className="bobo-status-row" aria-label="Report status">
              <span className="bobo-status-dot" aria-hidden="true" />
              <span>
                {lastFetched
                  ? `Latest report checked ${lastFetched.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`
                  : "Checking the latest report"}
              </span>
            </div>
          </div>

          <div className="bobo-portrait-wrap" aria-hidden="true">
            <div className="bobo-map-orbit">BOS · BU · CAM</div>
            <img
              src="/img/boston-weekend-agent-profile.png"
              alt=""
              className="bobo-portrait"
            />
          </div>
        </header>

        <article className="bobo-letter-card" data-aos="fade-up">
          <div className="bobo-letter-tab">WEEKEND REPORT</div>

          {!isLoading && !error && report ? (
            <div
              className="bobo-language-switch"
              role="tablist"
              aria-label="Choose report language"
            >
              <button
                type="button"
                role="tab"
                aria-selected={language === "en"}
                className={language === "en" ? "is-active" : ""}
                onClick={() => setLanguage("en")}
              >
                English <span>°F</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={language === "zh"}
                className={language === "zh" ? "is-active" : ""}
                onClick={() => setLanguage("zh")}
              >
                繁體中文 <span>°C</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={language === "activities"}
                className={language === "activities" ? "is-active" : ""}
                onClick={() => setLanguage("activities")}
              >
                Activities <span>{activities.length}</span>
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="bobo-loading" role="status" aria-live="polite">
              <span className="bobo-loading-face">⌖ˎˊ˗ 〔•ᴗ•〕</span>
              <p>Bo is unfolding the map…</p>
              <div className="bobo-loading-line" />
              <div className="bobo-loading-line bobo-loading-line-short" />
            </div>
          ) : error ? (
            <div className="bobo-error" role="alert">
              <span>⌖ˎˊ˗ 〔；ᴗ；〕</span>
              <p>{error}</p>
              <button
                type="button"
                className="bobo-retry-button"
                onClick={() => {
                  setIsLoading(true);
                  setReloadKey((value) => value + 1);
                }}
              >
                Try again · 再試一次
              </button>
            </div>
          ) : language === "activities" ? (
            <section
              className="bobo-activities"
              role="tabpanel"
              aria-label="Weekend activity candidates"
            >
              <div className="bobo-activities-heading">
                <div>
                  <p className="bobo-activities-kicker">EXPLORE THE FULL LIST</p>
                  <h2>Weekend activities</h2>
                  <p>
                    Every eligible event in this report&apos;s source snapshot—not
                    only Bo&apos;s editorial picks.
                  </p>
                </div>
                <div className="bobo-activities-count" aria-live="polite">
                  <strong>{visibleActivities.length}</strong>
                  <span>of {activities.length} events</span>
                </div>
              </div>

              <div className="bobo-activity-controls">
                <label className="bobo-activity-search">
                  <span>Search</span>
                  <input
                    type="search"
                    value={activitySearch}
                    onChange={(event) => setActivitySearch(event.target.value)}
                    placeholder="Music, Cambridge, festival…"
                  />
                </label>
                <label>
                  <span>Date</span>
                  <select
                    value={activityDate}
                    onChange={(event) => setActivityDate(event.target.value)}
                  >
                    <option value="all">All dates</option>
                    {activityDates.map((date) => (
                      <option key={date} value={date}>
                        {activityDateLabel(date)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>City</span>
                  <select
                    value={activityCity}
                    onChange={(event) => setActivityCity(event.target.value)}
                  >
                    <option value="all">All cities</option>
                    {activityCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Price</span>
                  <select
                    value={activityPrice}
                    onChange={(event) => setActivityPrice(event.target.value)}
                  >
                    <option value="all">All prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="unknown">Check listing</option>
                  </select>
                </label>
                <label>
                  <span>Sort</span>
                  <select
                    value={activitySort}
                    onChange={(event) => setActivitySort(event.target.value)}
                  >
                    <option value="date-asc">Date &amp; time</option>
                    <option value="title-asc">Title A–Z</option>
                    <option value="city-asc">City A–Z</option>
                    <option value="price-asc">Lowest price</option>
                    <option value="likes-desc">Most liked</option>
                  </select>
                </label>
              </div>

              {FEEDBACK_API_URL ? (
                <div className="bobo-feedback-note" aria-live="polite">
                  <span>♡</span>
                  <p>
                    Like what catches your eye. Your vote is anonymous, reversible,
                    and saved once per browser.
                  </p>
                  {feedbackError ? <strong>{feedbackError}</strong> : null}
                </div>
              ) : null}

              {visibleActivities.length ? (
                <div className="bobo-activity-table-wrap">
                  <table className="bobo-activity-table">
                    <thead>
                      <tr>
                        <th scope="col">Activity</th>
                        <th scope="col">Date &amp; time</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price</th>
                        <th scope="col">Source</th>
                        {FEEDBACK_API_URL ? <th scope="col">Likes</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleActivities.map((activity) => (
                        <tr key={activity.event_id || activity.url}>
                          <td>
                            {activity.url ? (
                              <a
                                href={activity.url}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                {activity.title}
                              </a>
                            ) : (
                              <strong>{activity.title}</strong>
                            )}
                            <span className="bobo-activity-meta">
                              {activityCategoryLabel(activity.category)}
                            </span>
                          </td>
                          <td>
                            <strong>{activityDateLabel(activity.date)}</strong>
                            <span>{activityTimeLabel(activity.time)}</span>
                          </td>
                          <td>
                            <strong>
                              {activity.city || activity.location || "Greater Boston"}
                            </strong>
                            {activity.location && activity.location !== activity.city ? (
                              <span>{activity.location}</span>
                            ) : null}
                          </td>
                          <td>
                            <span
                              className={`bobo-price-tag is-${activity.price_type || "unknown"}`}
                            >
                              {activity.price || "Check listing"}
                            </span>
                          </td>
                          <td>
                            <span>{activity.source || "Event organizer"}</span>
                          </td>
                          {FEEDBACK_API_URL ? (
                            <td>
                              <button
                                type="button"
                                className={`bobo-like-button ${
                                  activityFeedback[activity.event_id]?.liked
                                    ? "is-liked"
                                    : ""
                                }`}
                                aria-pressed={Boolean(
                                  activityFeedback[activity.event_id]?.liked,
                                )}
                                aria-label={`${
                                  activityFeedback[activity.event_id]?.liked
                                    ? "Unlike"
                                    : "Like"
                                } ${activity.title}`}
                                disabled={feedbackBusy.includes(activity.event_id)}
                                onClick={() => toggleActivityLike(activity.event_id)}
                              >
                                <span aria-hidden="true">
                                  {activityFeedback[activity.event_id]?.liked
                                    ? "♥"
                                    : "♡"}
                                </span>
                                {activityFeedback[activity.event_id]?.likes || 0}
                              </button>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bobo-activities-empty">
                  <span>⌖ˎˊ˗ 〔・_・?〕</span>
                  <p>No activities match these filters yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActivitySearch("");
                      setActivityCity("all");
                      setActivityDate("all");
                      setActivityPrice("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
          ) : (
            <div
              className="bobo-report-content"
              role="tabpanel"
              lang={language === "zh" ? "zh-Hant" : "en"}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ children, ...props }) => (
                    <a {...props} target="_blank" rel="noreferrer noopener">
                      {children}
                    </a>
                  ),
                }}
              >
                {activeReport}
              </ReactMarkdown>
            </div>
          )}
        </article>

        <footer className="bobo-weekend-footer" data-aos="fade-up">
          <span>Collected and ranked on AWS</span>
          <span aria-hidden="true">·</span>
          <span>Written in Bo&apos;s bilingual voice</span>
          <span aria-hidden="true">·</span>
          <span>Always verify details with the organizer</span>
        </footer>
      </section>
    </main>
  );
};

export default WeekendReport;
