import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { FiDownload, FiTrendingUp } from "react-icons/fi";

import "../components/chartSetup";
import SalesChart from "../components/SalesChart";
import { api } from "../services/api";

function Analytics() {
  const [revenueStats, setRevenueStats] = useState({ revenue: 0, estimated_profit: 0, profit_margin: 30 });
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [revRes, topRes, monthlyRes] = await Promise.all([
          api.analytics.revenue(),
          api.analytics.topProducts(),
          api.analytics.monthlySales()
        ]);

        setRevenueStats(revRes.revenue || { revenue: 0, estimated_profit: 0, profit_margin: 30 });
        
        const mappedTop = (topRes.items || []).map(p => ({
          name: p.product_name,
          sales: p.units_sold
        }));
        setTopProducts(mappedTop);

        const mappedMonthly = (monthlyRes.items || []).map(m => ({
          month: m.month,
          sales: m.sales,
          revenue: Math.round(m.revenue),
          profit: Math.round(m.revenue * (revRes.revenue?.profit_margin || 30) / 100)
        }));
        setMonthlySales(mappedMonthly);

      } catch (err) {
        setError(err.message || "Failed to load analytics reports");
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center" }}>Loading Analytics Dashboard...</div>;
  if (error) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>Error: {error}</div>;

  const costPercentage = 100 - revenueStats.profit_margin;
  const profitChart = {
    labels: ["Gross Revenue", "Operating Cost", "Net Margin"],
    datasets: [
      {
        data: [100, costPercentage, revenueStats.profit_margin],
        backgroundColor: ["#1d4ed8", "#93c5fd", "#0f172a"],
        borderWidth: 0,
      },
    ],
  };

  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyValues = [12.4, 14.2, 15.8, 13.6, 18.1, 19.4, 11.9];

  return (
    <div className="page-stack">
      <section className="analytics-grid analytics-grid--top">
        <SalesChart 
          labels={monthlySales.map((item) => item.month)} 
          values={monthlySales.map((item) => item.revenue)} 
          title="Revenue Chart" 
        />
        <SalesChart 
          labels={weeklyLabels} 
          values={weeklyValues} 
          title="Sales Chart" 
        />

        <section className="chart-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Profitability</p>
              <h3>Profit Chart</h3>
            </div>
          </div>
          <div className="chart-card__canvas chart-card__canvas--doughnut">
            <Doughnut
              data={profitChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { color: "#334155" } } },
              }}
            />
          </div>
        </section>
      </section>

      <section className="analytics-grid analytics-grid--bottom">
        <article className="panel-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Best sellers</p>
              <h3>Top Performing Products</h3>
            </div>
          </div>
          <ul className="rank-list">
            {topProducts.map((product) => (
              <li key={product.name}>
                <strong>{product.name}</strong>
                <span>{product.sales} units sold</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Reports</p>
              <h3>Monthly Summary</h3>
            </div>
            <button className="primary-button" type="button">
              <FiDownload /> Download Report
            </button>
          </div>

          <div className="report-list">
            {monthlySales.map((row) => (
              <div key={row.month} className="report-list__item">
                <span>{row.month}</span>
                <strong>${row.revenue} revenue</strong>
                <small>${row.profit} profit</small>
              </div>
            ))}
          </div>

          <div className="trend-banner">
            <FiTrendingUp />
            <p>Monthly sales are projected to dynamically adjust based on model insights.</p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Analytics;