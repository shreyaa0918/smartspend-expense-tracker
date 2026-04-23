import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const palette = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4"];

export default function SpendingChart() {
  const { items } = useSelector((state) => state.transactions);

  const { labels, values } = useMemo(() => {
    const grouped = items
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => {
        const key = transaction.category || "Other";
        acc[key] = (acc[key] || 0) + Number(transaction.amount);
        return acc;
      }, {});

    return {
      labels: Object.keys(grouped),
      values: Object.values(grouped)
    };
  }, [items]);

  if (!labels.length) {
    return (
      <section className="transaction-card chart-card">
        <h2>Spending by category</h2>
        <p className="dashboard-status">Add expense transactions to view category breakdown.</p>
      </section>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, index) => palette[index % palette.length]),
        borderWidth: 1
      }
    ]
  };

  return (
    <section className="transaction-card chart-card">
      <h2>Spending by category</h2>
      <div className="chart-wrap">
        <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </section>
  );
}
