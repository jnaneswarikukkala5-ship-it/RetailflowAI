import React, { useState, useEffect } from "react";
import { FiActivity, FiAlertTriangle, FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

import DashboardCards from "../components/DashboardCards";
import InventoryChart from "../components/InventoryChart";
import SalesChart from "../components/SalesChart";
import { api } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, salesRes] = await Promise.all([
          api.analytics.dashboard(),
          api.sales.list(),
        ]);
        
        const d = dashRes.dashboard;
        const mappedStats = [
          { label: "Total Products", value: d.total_products, change: "Active items", tone: "blue", icon: FiBox },
          { label: "Revenue", value: `$${Number(d.revenue).toFixed(2)}`, change: `Est. Profit: $${Number(d.estimated_profit).toFixed(2)}`, tone: "navy", icon: FiDollarSign },
          { label: "Sales", value: d.total_sales, change: `Avg Order: $${Number(d.average_order_value).toFixed(2)}`, tone: "sky", icon: FiShoppingCart },
          { label: "Low Stock Alerts", value: d.low_stock_alerts, change: "Needs restocking", tone: "amber", icon: FiAlertTriangle },
        ];
        setStats(mappedStats);

        const mappedOrders = (salesRes.items || []).slice(0, 5).map(item => ({
          id: `RF-${1000 + item.id}`,
          customer: item.customer_name || "Walk-In Customer",
          item: item.product_name,
          amount: `$${Number(item.total_amount).toFixed(2)}`,
          status: "Paid"
        }));
        setOrders(mappedOrders);

        const mappedActivities = (salesRes.items || []).slice(0, 4).map(item => ({
          text: `Recorded sale of ${item.quantity}x ${item.product_name} via ${item.payment_method}.`,
          time: new Date(item.sale_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setActivities(mappedActivities);

      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center" }}>Loading Dashboard Data...</div>;
  if (error) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>Error: {error}</div>;

  return (
    <div className="dashboard-grid">
      <DashboardCards items={stats} />

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
              {orders.map((order) => (
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
            {activities.map((activity, index) => (
              <li key={index}>
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