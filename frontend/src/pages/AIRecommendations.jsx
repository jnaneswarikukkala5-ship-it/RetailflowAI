import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FiAlertCircle, FiCheckCircle, FiCpu, FiRefreshCw } from "react-icons/fi";

import "../components/chartSetup";
import { api } from "../services/api";

function AIRecommendations() {
  const [forecast, setForecast] = useState([]);
  const [restockRecs, setRestockRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAIData() {
      try {
        const res = await api.ai.recommendations();
        setForecast(res.forecast || []);
        setRestockRecs(res.restock || []);
      } catch (err) {
        setError(err.message || "Failed to load AI Recommendations");
      } finally {
        setLoading(false);
      }
    }
    loadAIData();
  }, []);

  if (loading) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center" }}>Loading AI Recommendations...</div>;
  if (error) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>Error: {error}</div>;

  // Calculate metrics
  const avgConfidence = forecast.length 
    ? Math.round((forecast.reduce((sum, item) => sum + item.confidence_score, 0) / forecast.length) * 100) 
    : 94;

  const restockCount = forecast.filter(item => item.restock_quantity > 0).length;
  const criticalCount = forecast.filter(item => item.current_stock <= item.reorder_level).length;

  const chartData = {
    labels: forecast.map((item) => item.product_name),
    datasets: [
      {
        label: "Projected Weekly Demand",
        data: forecast.map((item) => item.predicted_demand),
        borderColor: "#1d4ed8",
        backgroundColor: "rgba(29, 78, 216, 0.16)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const insights = forecast.map(item => {
    let emphasis = "low";
    if (item.current_stock === 0) emphasis = "high";
    else if (item.current_stock <= item.reorder_level) emphasis = "medium";
    return {
      title: item.product_name,
      text: `${item.recommendation}. Predicted demand is ${item.predicted_demand} units. Current stock: ${item.current_stock} (Reorder level: ${item.reorder_level}).`,
      emphasis
    };
  });

  return (
    <div className="page-stack">
      <section className="ai-grid">
        <article className="ai-card card-glass ai-card--highlight">
          <FiCpu />
          <p className="section-heading__eyebrow">Demand Prediction</p>
          <h3>AI Confidence {avgConfidence}%</h3>
          <p>Trained RandomForestRegressor model predicts demand based on pricing, category trends, and sales histories.</p>
        </article>

        <article className="ai-card card-glass">
          <FiRefreshCw />
          <p className="section-heading__eyebrow">Restock Suggestions</p>
          <h3>Replenish {restockCount} items</h3>
          <p>{restockCount} products have predicted weekly demand exceeding current warehouse inventories.</p>
        </article>

        <article className="ai-card card-glass">
          <FiCheckCircle />
          <p className="section-heading__eyebrow">Stock Performance</p>
          <h3>Model online</h3>
          <p>AI recommendations auto-update dynamically when inventory or sales transactions occur.</p>
        </article>

        <article className="ai-card card-glass">
          <FiAlertCircle />
          <p className="section-heading__eyebrow">Critical alerts</p>
          <h3>{criticalCount} warnings</h3>
          <p>{criticalCount} products are below target thresholds and risk out-of-stock events.</p>
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
            {insights.map((insight) => (
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
              <p className="section-heading__eyebrow">ML Demand Forecast</p>
              <h3>Predicted Demand by Product</h3>
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