import React from "react";
import { FiActivity, FiAlertTriangle, FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

import DashboardCards from "../components/DashboardCards";
import InventoryChart from "../components/InventoryChart";
import SalesChart from "../components/SalesChart";
import { dashboardStats, recentActivities, recentOrders } from "../data/mockData";

const statsWithIcons = [
  { ...dashboardStats[0], icon: FiBox },
  { ...dashboardStats[1], icon: FiDollarSign },
  { ...dashboardStats[2], icon: FiShoppingCart },
  { ...dashboardStats[3], icon: FiAlertTriangle },
];

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <DashboardCards items={statsWithIcons} />

      <div className="dashboard-grid__charts">
        <SalesChart labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} values={[42, 55, 63, 71, 79, 91]} title="Sales Line Chart" />
        <InventoryChart labels={["Electronics", "Accessories", "Home", "Furniture", "Apparel"]} values={[86, 64, 49, 33, 28]} title="Inventory Bar Chart" />
      </div>

      <section className="table-card card-glass">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Operations</p>
            <h3>Recent Orders</h3>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.item}</td>
                  <td>{order.amount}</td>
                  <td><span className="status-pill status-pill--healthy">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-secondary-grid">
        <article className="panel-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">AI Insights</p>
              <h3>Smart retail recommendations</h3>
            </div>
          </div>
          <div className="insight-stack">
            <div><FiActivity /><p>AI detected a 16% lift in accessories demand next week.</p></div>
            <div><FiUsers /><p>Customer repeat purchases are strongest in the 25-34 age group.</p></div>
          </div>
        </article>

        <article className="panel-card card-glass">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Recent activity</p>
              <h3>Live updates</h3>
            </div>
          </div>
          <ul className="activity-list">
            {recentActivities.map((activity) => (
              <li key={activity.time}>
                <strong>{activity.text}</strong>
                <span>{activity.time}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;