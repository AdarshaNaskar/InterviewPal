import { useState, useRef } from "react";
import "../styles/Home.scss";
import { useInterview } from "../hook/useInterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

import FileText from "../../../assets/file-text.svg";
import FileUP from "../../../assets/file-up.svg";
import User from "../../../assets/user-round.svg";
import History from "../../../assets/rotate-ccw-clock.svg";
import Upload from "../../../assets/arrow-up-from-line.svg";
import Logout from "../../../assets/log-out.svg";
import Sparkle from "../../../assets/sparkles.svg";

// ─── Sub-components (UI Layer) ────────────────────────────────────────────────

const PageHeader = () => (
  <div className="home__header">
    <div className="home__header-icon">
      <img
        src={Sparkle}
        alt="sparkle-icon"
        className="icon"
        style={{ height: "30px", width: "30px" }}
      />
    </div>
    <div className="home__header-text">
      <h1>
        Create your{" "}
        <span className="home__header-highlight">preparation report</span>
      </h1>
      <p>
        Add the job details, your resume and a short introduction to get a
        personalized report.
      </p>
    </div>
  </div>
);

const UserNavigation = ({ username, onLogout, onHistory }) => {
  const [isOpen, setIsOpen] = useState(false);

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
                onHistory();
              }}
            >
              <img src={History} alt="history" className="icon" />
              History
            </button>

            <button
              type="button"
              className="home__logout-btn"
              onClick={onLogout}
            >
              <img src={Logout} alt="logout-icon" className="icon" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const JobDescriptionCard = ({ value, onChange }) => (
  <div className="home__card home__card--left">
    <div className="home__card-header">
      <div className="home__card-icon home__card-icon--red">
        <img src={FileText} alt="filetext" className="icon" />
      </div>
      <div>
        <h2 className="home__card-title">Job Description</h2>
        <p className="home__card-subtitle">Add the job description here.</p>
      </div>
    </div>

    <div className="home__textarea-wrapper">
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        id="jobDescription"
        name="jobDescription"
        className="home__textarea"
        placeholder="Enter the job description here..."
        maxLength={3000}
      />
      <span className="home__char-count">{value.length}/3000</span>
    </div>
  </div>
);

const ResumeUploadCard = ({ resumeInputRef, selectedFile, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="home__card home__card--resume">
      <div className="home__card-header">
        <div className="home__card-icon home__card-icon--red">
          <img src={FileUP} alt="file-up" className="icon" />
        </div>

        <div>
          <h2 className="home__card-title">Resume</h2>
          <p className="home__card-subtitle">
            Upload your latest resume (PDF, DOC, DOCX).
          </p>
        </div>
      </div>

      <div
        className={`home__dropzone ${
          isDragging ? "home__dropzone--dragging" : ""
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();

          if (
            !event.relatedTarget ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <div className="home__dropzone-icon">
          <img
            src={Upload}
            alt="upload"
            className="icon"
            style={{ width: "35px", height: "35px" }}
          />
        </div>

        <p className="home__dropzone-text">
          {isDragging
            ? "Drop your resume here"
            : selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Drag and drop your resume here"}
        </p>

        <span className="home__dropzone-or">or</span>

        <label htmlFor="resume" className="home__upload-btn">
          {selectedFile ? "Change resume" : "Upload resume"}
        </label>

        <input
          ref={resumeInputRef}
          hidden
          type="file"
          name="resume"
          id="resume"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
        />

        <span className="home__dropzone-hint">PDF, DOC, DOCX (Max 3MB)</span>
      </div>
    </div>
  );
};

const SelfDescriptionCard = ({ value, onChange }) => (
  <div className="home__card home__card--self">
    <div className="home__card-header">
      <div className="home__card-icon home__card-icon--red">
        <img src={User} alt="user-icon" className="icon" />
      </div>
      <div>
        <h2 className="home__card-title">Self Description</h2>
        <p className="home__card-subtitle">Tell us briefly about yourself.</p>
      </div>
    </div>

    <div className="home__textarea-wrapper">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="selfDescription"
        name="selfDescription"
        className="home__textarea home__textarea--short"
        placeholder="Enter self description..."
        maxLength={2000}
      />
      <span className="home__char-count">{value.length}/2000</span>
    </div>
  </div>
);

const GenerateButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    className="home__generate-btn"
    type="button"
    disabled={disabled}
  >
    {disabled ? "Generating..." : "Generate Preparation Report"}
    <span className="home__generate-btn-arrow">{"→"}</span>
  </button>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const Home = () => {
  const { user, handleLogout } = useAuth();

  const { loading, reportsLoading, generateReport, reports } = useInterview();
  const resumeInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Restore draft state from sessionStorage if mobile browser reloads on file picker
  const [jobDescription, setJobDescription] = useState(() => {
    return sessionStorage.getItem("draft_job_description") || "";
  });
  const [selfDescription, setSelfDescription] = useState(() => {
    return sessionStorage.getItem("draft_self_description") || "";
  });

  const navigate = useNavigate();

  const handleJobDescriptionChange = (val) => {
    setJobDescription(val);
    sessionStorage.setItem("draft_job_description", val);
    if (errorMessage) setErrorMessage("");
  };

  const handleSelfDescriptionChange = (val) => {
    setSelfDescription(val);
    sessionStorage.setItem("draft_self_description", val);
    if (errorMessage) setErrorMessage("");
  };

  const handleUserLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleFileChange = (input) => {
    const isInputEvent = Boolean(input?.target?.files);
    const file = isInputEvent ? input.target.files?.[0] : input;

    if (!file) return;

    const allowedExtensions = /\.(pdf|doc|docx)$/i;

    if (!allowedExtensions.test(file.name)) {
      setErrorMessage("Please upload a PDF, DOC, or DOCX file.");

      setSelectedFile(null);

      if (isInputEvent) {
        input.target.value = "";
      }

      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage(
        "File size exceeds 3MB limit. Please upload a smaller file.",
      );

      setSelectedFile(null);

      if (isInputEvent) {
        input.target.value = "";
      }

      return;
    }

    setSelectedFile(file);
    setErrorMessage("");

    if (!isInputEvent && resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = selectedFile || resumeInputRef.current?.files?.[0];

    if (!jobDescription.trim()) {
      setErrorMessage("Please enter the Job Description.");
      return;
    }
    if (!resumeFile) {
      setErrorMessage("Please upload your Resume.");
      return;
    }
    if (!selfDescription.trim()) {
      setErrorMessage("Please enter a brief Self Description.");
      return;
    }

    setErrorMessage("");
    const result = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (result.success && result.data?._id) {
      // Clear saved drafts on successful submission
      sessionStorage.removeItem("draft_job_description");
      sessionStorage.removeItem("draft_self_description");
      navigate(`/interview/${result.data._id}`);
    } else {
      setErrorMessage(
        result.error || "Failed to generate report. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-screen__spinner">
          <div className="loading-screen__ring" />
          <div className="loading-screen__ring-inner" />
          <div className="loading-screen__dot" />
        </div>
        <p className="loading-screen__text">Loading your interview plan…</p>
        <div className="loading-screen__dots">
          <span />
          <span />
          <span />
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <UserNavigation
        username={user?.username}
        onLogout={handleUserLogout}
        onHistory={() => navigate("/history")}
      />

      <div className="home__container">
        <PageHeader />

        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "rgba(210, 13, 61, 0.15)",
              border: "1px solid #d20d3d",
              borderRadius: "8px",
              color: "#ff4d6d",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            {errorMessage}
          </div>
        )}

        <div className="home__grid">
          {/* Left Column */}
          <JobDescriptionCard
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />

          {/* Right Column */}
          <div className="home__right-col">
            <ResumeUploadCard
              resumeInputRef={resumeInputRef}
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
            />
            <SelfDescriptionCard
              value={selfDescription}
              onChange={handleSelfDescriptionChange}
            />
            <GenerateButton onClick={handleGenerateReport} disabled={loading} />
          </div>
        </div>
        {/* Recent Reports List */}
        {(reportsLoading || reports.length > 0) && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>
            {reportsLoading ? (
              <p className="report-list--loading">Loading recent reports…</p>
            ) : (
              <ul className="report-list">
                {[...reports]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((report) => (
                    <li
                      key={report._id}
                      className="report-item"
                      onClick={() => navigate(`/interview/${report._id}`)}
                    >
                      <h3>{report.title || "Untitled Position"}</h3>
                      <p className="report-meta">
                        Generated on{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      <p
                        className={`match-score ${report.matchScore >= 80 ? `score--high` : report.matchScore >= 60 ? `score--medium` : `score--low`}`}
                      >
                        Match Score: {report.matchScore}%
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Home;
