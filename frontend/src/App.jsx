import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import AIRecommendations from "./pages/AIRecommendations";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <AppShell pageTitle="Dashboard" pageDescription="Operational overview for RetailFlow AI">
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/products"
          element={
            <AppShell pageTitle="Products" pageDescription="Manage retail catalog, pricing, and inventory">
              <Products />
            </AppShell>
          }
        />
        <Route
          path="/inventory"
          element={
            <AppShell pageTitle="Inventory" pageDescription="Track warehouse health and low-stock signals">
              <Inventory />
            </AppShell>
          }
        />
        <Route
          path="/analytics"
          element={
            <AppShell pageTitle="Analytics" pageDescription="Performance, profit, and sales intelligence">
              <Analytics />
            </AppShell>
          }
        />
        <Route
          path="/ai-recommendations"
          element={
            <AppShell pageTitle="AI Recommendations" pageDescription="Forecasts and optimization suggestions">
              <AIRecommendations />
            </AppShell>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;