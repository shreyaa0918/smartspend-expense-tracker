import React from "react";
import Navbar from "../components/common/Navbar";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-placeholder">
        <h1>Dashboard</h1>
        <p>
          Dashboard module is intentionally a placeholder for now. Auth, route protection, and
          logout flow are ready.
        </p>
      </main>
    </div>
  );
}
