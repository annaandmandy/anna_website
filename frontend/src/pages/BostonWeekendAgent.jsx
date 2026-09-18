import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../components/SEO";
import "../styles/boston-weekend-agent.css";

const REPORT_URL =
  "https://d2ugiuoady5eh5.cloudfront.net/reports/weekend_summary.json";

const WeekendReport = () => {
  const [report, setReport] = useState(null);
  const [language, setLanguage] = useState("zh");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
          "波波目前收不到最新地圖訊號，請稍後再回來看看。 Bo cannot reach the latest map signal right now—please try again soon.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
    const intervalId = setInterval(fetchReport, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [reloadKey]);

  const activeReport = report?.languages?.[language]?.markdown ?? "";

  return (
    <main className="bobo-weekend-page">
      <SEO
        title="波波的 Boston Weekend Letter"
        description="A bilingual, AI-assisted weekend letter with verified events, weather, and local ideas around Greater Boston."
        name="Boston Weekend Agent"
        type="article"
      />

      <section className="container bobo-weekend-shell">
        <header className="bobo-weekend-hero" data-aos="fade-down">
          <div className="bobo-hero-copy">
            <p className="bobo-eyebrow">A LETTER FROM BOSTON</p>
            <h1>波波的週末來信</h1>
            <p className="bobo-hero-subtitle">
              Boston Weekend Letter · 繁中與 English
            </p>
            <p className="bobo-hero-intro">
              天氣、活動，還有一點住在 Boston 才懂的週末節奏。波波會在週四先送來計畫版，週五早上再檢查變化。
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
          <div className="bobo-letter-tab">THIS WEEKEND</div>

          {!isLoading && !error && report ? (
            <div
              className="bobo-language-switch"
              role="tablist"
              aria-label="選擇報告語言"
            >
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
                aria-selected={language === "en"}
                className={language === "en" ? "is-active" : ""}
                onClick={() => setLanguage("en")}
              >
                English <span>°F</span>
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="bobo-loading" role="status" aria-live="polite">
              <span className="bobo-loading-face">⌖ˎˊ˗ 〔•ᴗ•〕</span>
              <p>波波正在展開地圖……</p>
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
                再試一次 · Try again
              </button>
            </div>
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
          <span>Written in 波波's bilingual voice</span>
          <span aria-hidden="true">·</span>
          <span>Always verify details with the organizer</span>
        </footer>
      </section>
    </main>
  );
};

export default WeekendReport;
