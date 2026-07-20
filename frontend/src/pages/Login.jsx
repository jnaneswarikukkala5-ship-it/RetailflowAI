import React from "react";
import { FiArrowRight, FiLock, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

function Login() {
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

        <form className="login-form">
          <p className="section-heading__eyebrow">Welcome back</p>
          <h1>Login to RetailFlow AI</h1>

          <label className="field">
            <span><FiMail /> Email</span>
            <input type="email" placeholder="admin@retailflow.ai" />
          </label>

          <label className="field">
            <span><FiLock /> Password</span>
            <input type="password" placeholder="Enter your password" />
          </label>

          <div className="login-form__row">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <a href="mailto:support@retailflow.ai">Forgot Password?</a>
          </div>

          <button className="primary-button primary-button--full" type="submit">
            Login <FiArrowRight />
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