/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../styles/interview.scss";
import { useInterview } from "../hook/useInterview";
import { useNavigate, useParams } from "react-router";

// ─── Nav Icons ────────────────────────────────────────────────────────────────
const IconDocument = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20M8 13H16M8 17H13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3V18M15 6V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions", Icon: IconDocument },
  { id: "behavioral", label: "Behavioral Questions", Icon: IconChat },
  { id: "roadmap", label: "Road Map", Icon: IconMap },
];

// ─── Question Card ────────────────────────────────────────────────────────────
const QuestionCard = ({ index, question, intention, answer, type }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`iv-question-card iv-question-card--${type}`}>
      <button
        className="iv-question-card__header"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <span className="iv-question-card__index">Q{index + 1}</span>
        <span className="iv-question-card__q">{question}</span>
        <span className={`iv-question-card__chevron ${open ? "open" : ""}`}>
          ›
        </span>
      </button>

      {open && (
        <div className="iv-question-card__body">
          <div className="iv-question-card__intention">
            <span className="iv-question-card__label">Intention</span>
            <p>{intention}</p>
          </div>
          <div className="iv-question-card__answer">
            <span className="iv-question-card__label">Model Answer</span>
            <p>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Day Card ─────────────────────────────────────────────────────────────────
const DayCard = ({ day, focus, tasks }) => (
  <div className="iv-day-card">
    <div className="iv-day-card__head">
      <span className="iv-day-card__badge">DAY {day}</span>
      <h3 className="iv-day-card__focus">{focus}</h3>
    </div>
    <ul className="iv-day-card__tasks">
      {tasks.map((t, i) => (
        <li key={i} className="iv-day-card__task">
          <span className="iv-day-card__dot" />
          {t}
        </li>
      ))}
    </ul>
  </div>
);

// ─── Panels ───────────────────────────────────────────────────────────────────
const TechnicalPanel = ({ questions }) => (
  <div className="iv-panel">
    <div className="iv-panel__header">
      <h2 className="iv-panel__title">Technical Questions</h2>
      <p className="iv-panel__subtitle">
        Review these questions to strengthen your technical depth before the
        interview.
      </p>
    </div>
    <div className="iv-panel__list">
      {questions.map((q, i) => (
        <QuestionCard key={i} index={i} {...q} type="technical" />
      ))}
    </div>
  </div>
);

const BehavioralPanel = ({ questions }) => (
  <div className="iv-panel">
    <div className="iv-panel__header">
      <h2 className="iv-panel__title">Behavioral Questions</h2>
      <p className="iv-panel__subtitle">
        Practice these to effectively communicate your experiences and soft
        skills.
      </p>
    </div>
    <div className="iv-panel__list">
      {questions.map((q, i) => (
        <QuestionCard key={i} index={i} {...q} type="behavioral" />
      ))}
    </div>
  </div>
);

const RoadmapPanel = ({ plan }) => (
  <div className="iv-panel">
    <div className="iv-panel__header">
      <h2 className="iv-panel__title">Preparation Road Map</h2>
      <p className="iv-panel__subtitle">
        A day-by-day plan to close your skill gaps before the interview.
      </p>
    </div>
    <div className="iv-panel__list">
      {plan.map((d) => (
        <DayCard key={d.day} {...d} />
      ))}
    </div>
  </div>
);

// ─── Score Ring ───────────────────────────────────────────────────────────────
const SCORE_TIER = (score) => {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  return "red";
};

const TIER_COLORS = {
  green: { from: "#4ade80", to: "#16a34a" },
  yellow: { from: "#fde047", to: "#ca8a04" },
  red: { from: "#ff4d6d", to: "#d20d3d" },
};

const ScoreRing = ({ score }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tier = SCORE_TIER(score);
  const { from, to } = TIER_COLORS[tier];
  const gradId = `scoreGradient-${tier}`;

  return (
    <div className="iv-score">
      <svg className="iv-score__ring" viewBox="0 0 120 120">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          className="iv-score__track"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="9"
        />
        <circle
          className="iv-score__fill"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="9"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={`url(#${gradId})`}
        />
      </svg>
      <div className="iv-score__inner">
        <span className={`iv-score__value iv-score__value--${tier}`}>
          {score}%
        </span>
      </div>
    </div>
  );
};

// ─── Skill Block ──────────────────────────────────────────────────────────────
const SkillBlock = ({ skill, severity }) => (
  <div className={`iv-skill-block iv-skill-block--${severity}`}>{skill}</div>
);

// ─── Right Sidebar ────────────────────────────────────────────────────────────
const RightSidebar = ({ matchScore, skillGaps }) => (
  <aside className="iv-right">
    <div className="iv-right__section">
      <h3 className="iv-right__heading">MATCH SCORE</h3>
      <ScoreRing score={matchScore} />
    </div>

    <div className="iv-right__section">
      <h3 className="iv-right__heading">SKILL GAP</h3>
      <div className="iv-skill-blocks">
        {skillGaps.map((s, i) => (
          <SkillBlock key={i} {...s} />
        ))}
      </div>
    </div>
  </aside>
);

// ─── Interview Page ───────────────────────────────────────────────────────────
const Interview = () => {
  const [active, setActive] = useState("technical");

  const { report, getReportById, loading } = useInterview();

  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <div className="loading-screen__spinner">
          <div className="loading-screen__ring" />
          <div className="loading-screen__ring-inner" />
          <div className="loading-screen__dot" />
        </div>
        <p className="loading-screen__text">Loading interview report…</p>
        <div className="loading-screen__dots">
          <span />
          <span />
          <span />
        </div>
      </main>
    );
  }

  const {
    matchScore,
    technicalQuestions,
    behavioralQuestions,
    skillGaps,
    preparationPlan,
  } = report;

  const renderPanel = () => {
    if (active === "technical")
      return <TechnicalPanel questions={technicalQuestions} />;
    if (active === "behavioral")
      return <BehavioralPanel questions={behavioralQuestions} />;
    return <RoadmapPanel plan={preparationPlan} />;
  };

  return (
    <main className="iv">
      {/* Left Nav */}
      <nav className="iv-nav">
        <p className="iv-nav__heading">
          <b>SECTIONS</b>
        </p>
        <div className="iv-nav__inner">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`iv-nav__item ${active === id ? "iv-nav__item--active" : ""}`}
              onClick={() => setActive(id)}
            >
              <span className="iv-nav__icon">
                <Icon />
              </span>
              <span className="iv-nav__label">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Center Content */}
      <section className="iv-content">{renderPanel()}</section>

      {/* Right Sidebar */}
      <RightSidebar matchScore={matchScore} skillGaps={skillGaps} />
    </main>
  );
};

export default Interview;
