import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/auth.api";
import "../auth.form.scss";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email.trim());

      setMessage(
        response.message || "A reset link has been sent to this email.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="form-container">
        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address. We'll send you a password reset
          link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <p role="status" style={{ color: "#4ade80" }}>
              {message}
            </p>
          )}

          {error && (
            <p role="alert" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button primary-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p>
          Remember yout password? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
