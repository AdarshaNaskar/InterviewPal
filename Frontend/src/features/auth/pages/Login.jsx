/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

import EyeOpen from "../../../assets/eye.svg";
import EyeClosed from "../../../assets/eye-off.svg";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-screen__spinner">
          <div className="loading-screen__ring" />
          <div className="loading-screen__ring-inner" />
          <div className="loading-screen__dot" />
        </div>
        <p className="loading-screen__text">Loading...</p>
        <div className="loading-screen__dots">
          <span />
          <span />
          <span />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setemail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter the password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <img src={EyeOpen} alt="eye-open" />
                ) : (
                  <img src={EyeClosed} alt="eye-closed" />
                )}
              </button>
            </div>
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          <button className="button primary-button">Login</button>
        </form>

        <p>
          New Here? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
