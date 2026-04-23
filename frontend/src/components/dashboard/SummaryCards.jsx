import React, { useMemo } from "react";
import { useSelector } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export default function SummaryCards() {
  const { items } = useSelector((state) => state.transactions);

  const summary = useMemo(() => {
    const income = items
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expenses = items
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [items]);

  return (
    <section className="summary-grid">
      <article className="summary-card summary-card--balance">
        <p className="summary-card__label">Total Balance</p>
        <h3>{formatCurrency(summary.balance)}</h3>
      </article>
      <article className="summary-card summary-card--income">
        <p className="summary-card__label">Total Income</p>
        <h3>{formatCurrency(summary.income)}</h3>
      </article>
      <article className="summary-card summary-card--expense">
        <p className="summary-card__label">Total Expenses</p>
        <h3>{formatCurrency(summary.expenses)}</h3>
      </article>
    </section>
  );
}
