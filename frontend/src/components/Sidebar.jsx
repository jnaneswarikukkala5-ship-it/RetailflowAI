import React from "react";
import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiGrid, FiHome, FiLogOut, FiX, FiZap } from "react-icons/fi";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/products", label: "Products", icon: FiBox },
  { to: "/inventory", label: "Inventory", icon: FiHome },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/ai-recommendations", label: "AI Recommendations", icon: FiZap },
  { to: "/login", label: "Logout", icon: FiLogOut, danger: true },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__header">
        <div>
          <p className="sidebar__eyebrow">RetailFlow AI</p>
          <h1 className="sidebar__title">Inventory Command Center</h1>
        </div>
        <button className="sidebar__close" type="button" onClick={onClose} aria-label="Close navigation">
          <FiX />
        </button>
      </div>

      <p className="sidebar__subtitle">Professional retail operations dashboard for the hackathon demo.</p>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon, danger }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""} ${danger ? "sidebar__link--danger" : ""}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer card-glass">
        <p className="sidebar__footer-label">Live status</p>
        <strong>12 warehouses synced</strong>
        <span>Updated just now</span>
      </div>
    </aside>
  );
}

export default Sidebar;