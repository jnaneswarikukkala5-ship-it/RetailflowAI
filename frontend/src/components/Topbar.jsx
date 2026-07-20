import React, { useState, useEffect } from "react";
import { FiBell, FiMenu, FiSearch, FiSettings, FiUser, FiX } from "react-icons/fi";
import { api } from "../services/api";

function Topbar({ title, description, onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem("custom_api_url") || "http://localhost:5000/api");

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await api.inventory.list();
        const lowStock = (res.items || []).filter(item => item.status === "Low Stock" || item.status === "Out of Stock");
        setAlerts(lowStock);
      } catch (err) {
        // Suppress errors during load
      }
    }
    loadAlerts();
    const interval = setInterval(loadAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("custom_api_url", apiUrl);
    alert("Settings saved. Page will reload to apply adjustments.");
    window.location.reload();
  };

  return (
    <header className="topbar card-glass" style={{ position: "relative" }}>
      <div className="topbar__left">
        <button className="topbar__menu" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <FiMenu />
        </button>
        <div>
          <p className="topbar__eyebrow">RetailFlow AI</p>
          <h2 className="topbar__title">{title}</h2>
          <p className="topbar__description">{description}</p>
        </div>
      </div>

      <div className="topbar__actions">
        <label className="topbar__search">
          <FiSearch />
          <input type="search" placeholder="Search products, orders, or alerts" aria-label="Search dashboard" />
        </label>
        
        <button 
          className="icon-button" 
          type="button" 
          aria-label="Notifications"
          onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
          style={{ position: "relative" }}
        >
          <FiBell />
          {alerts.length > 0 && (
            <span style={{
              position: "absolute", top: 1, right: 1,
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: "#ef4444"
            }} />
          )}
        </button>

        <button 
          className="icon-button" 
          type="button" 
          aria-label="Settings"
          onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
        >
          <FiSettings />
        </button>

        <button className="topbar__profile" type="button" aria-label="User profile">
          <FiUser />
          <span>Admin</span>
        </button>
      </div>

      {showNotifications && (
        <div className="card-glass" style={{
          position: "absolute", top: "100%", right: "8rem",
          width: "300px", padding: "1rem", zIndex: 100,
          marginTop: "0.5rem", borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          textAlign: "left"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid rgba(148, 163, 184, 0.2)", paddingBottom: "0.25rem" }}>
            <h4 style={{ margin: 0 }}>System Notifications</h4>
            <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><FiX /></button>
          </div>
          {alerts.length === 0 ? (
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b" }}>No alerts at this time. All systems running optimally.</p>
          ) : (
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.875rem" }}>
              {alerts.map((item) => (
                <li key={item.id} style={{ marginBottom: "0.5rem", color: "#ef4444" }}>
                  <strong>{item.product_name}</strong> is in <strong>{item.status}</strong> status ({item.quantity} left).
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showSettings && (
        <div className="card-glass" style={{
          position: "absolute", top: "100%", right: "4rem",
          width: "280px", padding: "1rem", zIndex: 100,
          marginTop: "0.5rem", borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          textAlign: "left"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid rgba(148, 163, 184, 0.2)", paddingBottom: "0.25rem" }}>
            <h4 style={{ margin: 0 }}>System Settings</h4>
            <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><FiX /></button>
          </div>
          <form onSubmit={handleSaveSettings}>
            <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Backend API Base URL
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                style={{
                  width: "100%", padding: "0.35rem 0.5rem", marginTop: "0.25rem",
                  borderRadius: "4px", border: "1px solid #cbd5e1"
                }}
              />
            </label>
            <button 
              type="submit" 
              className="primary-button" 
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", marginTop: "0.5rem", width: "100%" }}
            >
              Save Settings
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Topbar;