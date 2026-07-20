import React from "react";
import { Doughnut } from "react-chartjs-2";
import { FiDownload, FiTrendingUp } from "react-icons/fi";

import "../components/chartSetup";
import SalesChart from "../components/SalesChart";
import { bestSellers, monthlySalesReport, weeklySalesReport } from "../data/mockData";

function Analytics() {
  const profitChart = {
    labels: ["Gross Profit", "Operating Cost", "Net Margin"],
    datasets: [
      {
        data: [46, 28, 26],
        backgroundColor: ["#1d4ed8", "#93c5fd", "#0f172a"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="page-stack">
      <section className="analytics-grid analytics-grid--top">
        <SalesChart labels={monthlySalesReport.map((item) => item.month)} values={monthlySalesReport.map((item) => item.revenue)} title="Revenue Chart" />
        <SalesChart labels={weeklySalesReport.map((item) => item.label)} values={weeklySalesReport.map((item) => item.value)} title="Sales Chart" />

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
            {bestSellers.map((product) => (
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
              <h3>Monthly and Weekly Summary</h3>
            </div>
            <button className="primary-button" type="button">
              <FiDownload /> Download Report
            </button>
          </div>

          <div className="report-list">
            {monthlySalesReport.map((row) => (
              <div key={row.month} className="report-list__item">
                <span>{row.month}</span>
                <strong>${row.revenue}K revenue</strong>
                <small>{row.profit}K profit</small>
              </div>
            ))}
          </div>

          <div className="trend-banner">
            <FiTrendingUp />
            <p>Monthly sales are projected to increase by 18% based on trend momentum.</p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Analytics;