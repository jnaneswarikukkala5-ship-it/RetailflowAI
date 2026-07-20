import React, { useState, useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw, FiTruck } from "react-icons/fi";

import { api } from "../services/api";

function Inventory() {
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInventory() {
      try {
        const res = await api.inventory.list();
        const rawItems = res.items || [];
        setItems(rawItems);

        // Filter out low stock alerts dynamically
        const lowStock = rawItems.filter(item => item.status === "Low Stock" || item.status === "Out of Stock");
        const mappedAlerts = lowStock.map(item => `${item.product_name} status is ${item.status}. Current stock: ${item.quantity} (reorder level: ${item.reorder_level}).`);
        setAlerts(mappedAlerts);
      } catch (err) {
        setError(err.message || "Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  if (loading) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center" }}>Loading Inventory List...</div>;
  if (error) return <div className="card-glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>Error: {error}</div>;

  const lowStockCount = items.filter(item => item.status === "Low Stock" || item.status === "Out of Stock").length;

  return (
    <div className="page-stack">
      <section className="inventory-summary">
        <article className="summary-card card-glass">
          <FiTruck />
          <h3>Warehouse Status</h3>
          <p>Active zones checked, all operations running normally.</p>
        </article>
        <article className="summary-card card-glass">
          <FiRefreshCw />
          <h3>Current Stock</h3>
          <p>{items.length} SKUs monitored in real time across warehousing systems.</p>
        </article>
        <article className="summary-card card-glass summary-card--warning">
          <FiAlertTriangle />
          <h3>Low Stock Alerts</h3>
          <p>{lowStockCount} products need immediate replenishment.</p>
        </article>
      </section>

      <section className="table-card card-glass">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Warehouse inventory</p>
            <h3>Inventory Table</h3>
          </div>
          <button className="secondary-button" type="button">Restock Selected</button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Current Stock</th>
                <th>Target</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const progress = Math.min((item.quantity / (item.reorder_level * 2)) * 100, 100);
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.product_name}</td>
                    <td>{item.warehouse_location}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reorder_level}</td>
                    <td><span className={`status-pill status-pill--${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                    <td>
                      <div className="progress-bar">
                        <span style={{ width: `${progress}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="alerts-grid">
        {alerts.map((alert) => (
          <article key={alert} className="alert-card card-glass">
            <FiAlertTriangle />
            <p>{alert}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Inventory;