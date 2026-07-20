import React from "react";
import { Line } from "react-chartjs-2";

import "./chartSetup";

function SalesChart({ labels, values, title = "Sales Trend" }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values,
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.18)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#1d4ed8",
        pointBorderWidth: 2,
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
      x: { grid: { color: "rgba(148, 163, 184, 0.15)" }, ticks: { color: "#475569" } },
      y: { grid: { color: "rgba(148, 163, 184, 0.15)" }, ticks: { color: "#475569" } },
    },
  };

  return (
    <section className="chart-card card-glass">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Performance</p>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="chart-card__canvas">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

export default SalesChart;