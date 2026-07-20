import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content container-narrow">
        <div>
          <h3>RetailFlow AI</h3>
          <p>AI-powered retail inventory management for demo, pitch, and hackathon presentations.</p>
        </div>
        <div className="footer__links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;