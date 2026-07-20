import React from "react";

function FeatureCards() {
  const cards = [
    {
      title: "Inventory Tracking",
      description: "Monitor stock levels in real time.",
    },
    {
      title: "AI Recommendation",
      description: "Predict demand using Machine Learning.",
    },
    {
      title: "Analytics Dashboard",
      description: "Visualize business performance.",
    },
  ];

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "25px",
        flexWrap: "wrap",
        padding: "60px 20px",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            width: "300px",
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </div>
      ))}
    </section>
  );
}

export default FeatureCards;