import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppShell({ pageTitle, pageDescription, children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        className={`app-shell__scrim ${isSidebarOpen ? "app-shell__scrim--visible" : ""}`}
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-shell__content">
        <Topbar title={pageTitle} description={pageDescription} onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;