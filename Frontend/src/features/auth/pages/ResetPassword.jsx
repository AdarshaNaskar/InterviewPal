import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { resetPassword } from "../services/auth.api";
import "../auth.form.scss";

import EyeOpen from "../../../assets/eye.svg";
import EyeClosed from "../../../assets/eye-off.svg";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(token, password);

      setMessage(response.message || "Password reset successfully.");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. The link may be invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h2>Reset Password</h2>

        <p>Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">New Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye icon
                  <img src={EyeOpen} alt="eye-open" />
                ) : (
                  // Eye-off icon
                  <img src={EyeClosed} alt="eye-closed" />
                )}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <img src={EyeOpen} alt="eye-open" />
                ) : (
                  <img src={EyeClosed} alt="eye-closed" />
                )}
              </button>
            </div>
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p>
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </main>
  );
}

export default ResetPassword;
