import React from "react";
import { FiBell, FiMenu, FiSearch, FiSettings, FiUser } from "react-icons/fi";

function Topbar({ title, description, onMenuClick }) {
  return (
    <header className="topbar card-glass">
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
        <button className="icon-button" type="button" aria-label="Notifications">
          <FiBell />
        </button>
        <button className="icon-button" type="button" aria-label="Settings">
          <FiSettings />
        </button>
        <button className="topbar__profile" type="button" aria-label="User profile">
          <FiUser />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;