import React from "react";

function Hero() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
        color: "white",
        textAlign: "center",
        padding: "100px 20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        AI Powered Inventory Management
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "700px",
          margin: "0 auto 30px",
        }}
      >
        Reduce stockouts, minimize waste, predict demand and improve profits
        using Artificial Intelligence.
      </p>

      <button
        style={{
          background: "#fff",
          color: "#2563eb",
          border: "none",
          padding: "15px 30px",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Get Started
      </button>
    </section>
  );
}

export default Hero;