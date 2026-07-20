import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h2>RetailFlow AI</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
          Products
        </Link>

        <Link to="/inventory" style={{ color: "white", textDecoration: "none" }}>
          Inventory
        </Link>

        <Link to="/analytics" style={{ color: "white", textDecoration: "none" }}>
          Analytics
        </Link>

        <Link to="/ai" style={{ color: "white", textDecoration: "none" }}>
          AI
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;