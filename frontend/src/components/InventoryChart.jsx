import React from "react";
import { Bar } from "react-chartjs-2";

import "./chartSetup";

function InventoryChart({ labels, values, title = "Inventory Health" }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Stock",
        data: values,
        backgroundColor: ["#60a5fa", "#2563eb", "#1d4ed8", "#93c5fd", "#0f172a"],
        borderRadius: 14,
        maxBarThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: "#0f172a", font: { size: 16, weight: "bold" } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#475569" } },
      y: { grid: { color: "rgba(148, 163, 184, 0.15)" }, ticks: { color: "#475569" } },
    },
  };

  return (
    <section className="chart-card card-glass">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Stock levels</p>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="chart-card__canvas">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

export default InventoryChart;