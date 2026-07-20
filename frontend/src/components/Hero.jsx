import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiDatabase, FiShield } from "react-icons/fi";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-section__content container-narrow">
        <div className="hero-copy card-glass">
          <p className="section-heading__eyebrow">RetailFlow AI</p>
          <h1>AI-Powered Retail Inventory Management System</h1>
          <p>
            A modern retail operations platform for tracking products, forecasting demand, monitoring warehouses,
            and making faster inventory decisions with AI assistance.
          </p>

          <div className="hero-copy__actions">
            <Link className="primary-button" to="/dashboard">
              Launch Dashboard <FiArrowRight />
            </Link>
            <Link className="secondary-button" to="/login">
              Sign In
            </Link>
          </div>

          <div className="hero-copy__stats">
            <div><FiDatabase /><strong>1,248</strong><span>Tracked SKUs</span></div>
            <div><FiBarChart2 /><strong>92%</strong><span>Forecast Accuracy</span></div>
            <div><FiShield /><strong>24/7</strong><span>Visibility</span></div>
          </div>
        </div>

        <div className="hero-visual card-glass">
          <div className="hero-visual__panel">
            <div className="hero-visual__badge">Live AI Snapshot</div>
            <div className="hero-visual__metric">
              <span>Revenue</span>
              <strong>$248.6K</strong>
            </div>
            <div className="hero-visual__spark">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero-visual__rows">
              <div><strong>Low Stock Alerts</strong><span>14 open items</span></div>
              <div><strong>Order Fill Rate</strong><span>98.2%</span></div>
              <div><strong>AI Confidence</strong><span>94%</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;