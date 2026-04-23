import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/common/Navbar";
import FilterBar from "../components/dashboard/FilterBar";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
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

        {error ? <p className="form-error dashboard-error">{error}</p> : null}

        <div className="dashboard-grid">
          <div>
            <TransactionForm />
          </div>
          <section className="transaction-card">
            <h2>Transaction history</h2>
            <FilterBar />
            <TransactionList />
          </section>
        </div>
      </main>
    </div>
  );
}
