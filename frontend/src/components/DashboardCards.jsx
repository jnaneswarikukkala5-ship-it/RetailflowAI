import React from "react";

function DashboardCards({ items }) {
  return (
    <section className="kpi-grid">
      {items.map((item) => (
        <article key={item.label} className={`kpi-card card-glass kpi-card--${item.tone}`}>
          <div className="kpi-card__header">
            <span>{item.label}</span>
            <item.icon />
          </div>
          <h3>{item.value}</h3>
          <p>{item.change}</p>
        </article>
      ))}
    </section>
  );
}

export default DashboardCards;