import React from "react";
import { FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";

const features = [
  { icon: FiShield, title: "Retail control", text: "Keep every SKU visible across locations, warehouses, and store fronts." },
  { icon: FiTrendingUp, title: "Predictive AI", text: "Forecast demand and identify stock risks before they affect revenue." },
  { icon: FiLayers, title: "Unified dashboard", text: "Monitor sales, inventory, and profit from one polished enterprise view." },
];

function FeatureCards() {
  return (
    <section className="features-section container-narrow">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <article key={feature.title} className="feature-card card-glass">
            <Icon />
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        );
      })}
    </section>
  );
}

export default FeatureCards;