import React from "react";
import { FiAlertTriangle, FiRefreshCw, FiTruck } from "react-icons/fi";

import { inventoryItems, lowStockAlerts } from "../data/mockData";

function Inventory() {
  return (
    <div className="page-stack">
      <section className="inventory-summary">
        <article className="summary-card card-glass">
          <FiTruck />
          <h3>Warehouse Status</h3>
          <p>5 active zones, 98.2% fulfillment rate, no critical delays.</p>
        </article>
        <article className="summary-card card-glass">
          <FiRefreshCw />
          <h3>Current Stock</h3>
          <p>1,248 SKUs monitored in real time across all retail locations.</p>
        </article>
        <article className="summary-card card-glass summary-card--warning">
          <FiAlertTriangle />
          <h3>Low Stock Alerts</h3>
          <p>{lowStockAlerts.length} products need immediate replenishment.</p>
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
              {inventoryItems.map((item) => {
                const progress = Math.min((item.stock / (item.min * 2)) * 100, 100);
                return (
                  <tr key={item.sku}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.warehouse}</td>
                    <td>{item.stock}</td>
                    <td>{item.min}</td>
                    <td><span className={`status-pill status-pill--${item.status.toLowerCase()}`}>{item.status}</span></td>
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
        {lowStockAlerts.map((alert) => (
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