import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/common/Navbar";
import FilterBar from "../components/dashboard/FilterBar";
import SpendingChart from "../components/dashboard/SpendingChart";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import ExportButton from "../components/dashboard/ExportButton";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";
import { fetchTransactions } from "../features/transactions/transactionThunks";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-shell">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Manage your income and expenses from one place.</p>
        </div>

        <SummaryCards />

        {error ? <p className="form-error dashboard-error">{error}</p> : null}

        {/* ── Top row: chart + recent transactions ── */}
        <div className="dashboard-top-grid">
          <SpendingChart />
          <section className="transaction-card">
            <h2>Recent transactions</h2>
            <TransactionList mode="recent" limit={5} />
          </section>
        </div>

        {/* ── Budget goals section ── */}
        <div className="dashboard-grid" style={{ marginBottom: "1rem" }}>
          <BudgetForm />
          <BudgetList />
        </div>

        {/* ── Add/edit + full history ── */}
        <div className="dashboard-grid">
          <div>
            <TransactionForm />
          </div>
          <section className="transaction-card">
            <div className="transaction-history-header">
              <h2>Transaction history</h2>
              <ExportButton />
            </div>
            <FilterBar />
            <TransactionList />
          </section>
        </div>
      </main>
    </div>
  );
}
