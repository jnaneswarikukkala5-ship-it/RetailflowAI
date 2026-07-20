import React, { useState } from "react";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.auth.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card card-glass">
        <div className="login-card__art">
          <div className="login-card__shape login-card__shape--one" />
          <div className="login-card__shape login-card__shape--two" />
          <div className="login-card__mock">
            <span>RetailFlow AI</span>
            <strong>Secure Access</strong>
            <p>Sign in to manage dashboards, inventory, and AI forecasts.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <p className="section-heading__eyebrow">Welcome back</p>
          <h1>Login to RetailFlow AI</h1>

          {error && (
            <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.5rem 0.75rem", borderRadius: "4px" }}>
              {error}
            </div>
          )}

          <label className="field">
            <span><FiMail /> Email</span>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@retailflow.ai" 
            />
          </label>

          <label className="field">
            <span><FiLock /> Password</span>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
            />
          </label>

          <div className="login-form__row">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <a href="mailto:support@retailflow.ai">Forgot Password?</a>
          </div>

          <button className="primary-button primary-button--full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"} <FiArrowRight />
          </button>

          <p className="login-form__note">
            Need a demo account? <Link to="/dashboard">Go to Dashboard</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;