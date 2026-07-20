import React from "react";
import { Line } from "react-chartjs-2";
import { FiAlertCircle, FiCheckCircle, FiCpu, FiRefreshCw } from "react-icons/fi";

import "../components/chartSetup";
import { aiInsights, futureTrend } from "../data/mockData";

function AIRecommendations() {
  const chartData = {
    labels: futureTrend.map((item) => item.month),
    datasets: [
      {
        label: "Projected Sales",
        data: futureTrend.map((item) => item.value),
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.16)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="page-stack">
      <section className="ai-grid">
        <article className="ai-card card-glass ai-card--highlight">
          <FiCpu />
          <p className="section-heading__eyebrow">Demand Prediction</p>
          <h3>AI Confidence 94%</h3>
          <p>Expected accessories demand will increase sharply over the next 14 days.</p>
        </article>

        <article className="ai-card card-glass">
          <FiRefreshCw />
          <p className="section-heading__eyebrow">Restock Suggestions</p>
          <h3>Auto reorder 3 products</h3>
          <p>Smartwatch, travel backpacks, and gaming mice should be replenished now.</p>
        </article>

        <article className="ai-card card-glass">
          <FiCheckCircle />
          <p className="section-heading__eyebrow">Sales Forecast</p>
          <h3>+18% next month</h3>
          <p>Projected revenue growth stays strong as store traffic rises seasonally.</p>
        </article>

        <article className="ai-card card-glass">
          <FiAlertCircle />
          <p className="section-heading__eyebrow">Smart Alerts</p>
          <h3>2 critical warnings</h3>
          <p>High-demand products may hit zero inventory if no transfer is scheduled.</p>
        </article>
      </section>

      <section className="analytics-grid analytics-grid--bottom">
        <article className="panel-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">AI recommendations</p>
              <h3>Optimization actions</h3>
            </div>
          </div>
          <div className="insight-stack">
            {aiInsights.map((insight) => (
              <div key={insight.title} className={`insight-stack__item insight-stack__item--${insight.emphasis}`}>
                <strong>{insight.title}</strong>
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </article>

        <section className="chart-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Future trend</p>
              <h3>Future Sales Trend Chart</h3>
            </div>
          </div>
          <div className="chart-card__canvas">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: "rgba(148, 163, 184, 0.15)" } },
                },
              }}
            />
          </div>
        </section>
      </section>
    </div>
  );
}

export default AIRecommendations;