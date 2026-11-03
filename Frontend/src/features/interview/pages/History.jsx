import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInterview } from "../hook/useInterview";

import "../styles/Home.scss";
import "../styles/History.scss";

const UserNavigation = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home__user-nav">
      <button
        type="button"
        className="home__hamburger"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        <>
          <button
            className="home__menu-backdrop"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          />
          <div className="home__user-menu">
            <div className="home__user-info">
              <div className="home__user-avatar">
                {username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="home__user-label">Logged in as</p>
                <p className="home__username">{username || "User"}</p>
              </div>
            </div>

            <div className="home__menu-divider" />

            <button
              type="button"
              className="home__logout-btn"
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
            >
              <span>⌂</span>
              Home
            </button>

            <button
              type="button"
              className="home__logout-btn"
              onClick={onLogout}
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { reports, reportsLoading } = useInterview();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const handleUserLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const filteredReports = [...reports]
    .filter((report) =>
      (report.title || "Untitled Position")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <main className="history-page">
      <UserNavigation username={user?.username} onLogout={handleUserLogout} />

      <div className="history__container">
        <header className="history__header">
          <p className="history__eyebrow">YOUR INTERVIEW JOURNEY</p>
          <h1>Report History</h1>
          <p>
            View and manage all your previously generated interview preparation
            reports.
          </p>
        </header>

        <section className="history__content">
          <div className="history__toolbar">
            <div className="history__search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="history__sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {reportsLoading ? (
            <div className="history__message">Loading your reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="history__empty">
              <div className="history__empty-icon">▤</div>
              <h2>
                {searchTerm ? "No matching reports found" : "No reports yet"}
              </h2>
              <p>
                {searchTerm
                  ? "Try search a different job title."
                  : "Generate your first interview preparation report to see it here"}
              </p>

              {!searchTerm && (
                <button type="button" onClick={() => navigate("/")}>
                  Create a report
                  <span> →</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="history__results">
                {filteredReports.length}{" "}
                {filteredReports.length === 1 ? "report" : "reports"} found
              </div>

              <div className="history__report-list">
                {filteredReports.map((report) => (
                  <article
                    key={report._id}
                    className="history__report-card"
                    onClick={() => navigate(`/interview/${report._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/interview/${report._id}`);
                      }
                    }}
                  >
                    <div className="history__report-info">
                      <h2>{report.title || "Untitled Position"}</h2>

                      <p>
                        Generated on{" "}
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="history__report-score">
                      <span
                        className={
                          report.matchScore >= 80
                            ? "score--high"
                            : report.matchScore >= 60
                              ? "score--medium"
                              : "score--low"
                        }
                      >
                        {report.matchScore}%
                      </span>
                      <small>Match Score</small>
                    </div>

                    <span className="history__report-arrow">→</span>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default History;
