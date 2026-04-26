import React from "react";
import { useSelector } from "react-redux";
import { exportTransactionsToCSV } from "../../utils/csvExport";

export default function ExportButton() {
  const { items, filters } = useSelector((state) => state.transactions);

  // Apply the same filtering logic as TransactionList so export matches what user sees
  const filteredTransactions = items.filter((transaction) => {
    const typeMatch = filters.type === "all" || transaction.type === filters.type;
    const categoryMatch = filters.category
      ? transaction.category.toLowerCase().includes(filters.category.toLowerCase())
      : true;

    let dateMatch = true;
    const value = new Date(transaction.date).getTime();
    if (filters.startDate) {
      dateMatch = dateMatch && value >= new Date(filters.startDate).getTime();
    }
    if (filters.endDate) {
      dateMatch = dateMatch && value <= new Date(filters.endDate).getTime();
    }

    return typeMatch && categoryMatch && dateMatch;
  });

  const handleExport = () => {
    // Build a descriptive filename based on active filters
    const parts = ["smartspend"];
    if (filters.type !== "all") parts.push(filters.type);
    if (filters.category) parts.push(filters.category.toLowerCase().replace(/\s+/g, "-"));
    if (filters.startDate) parts.push(`from-${filters.startDate}`);
    if (filters.endDate) parts.push(`to-${filters.endDate}`);
    parts.push(new Date().toISOString().slice(0, 10));
    const filename = `${parts.join("_")}.csv`;

    exportTransactionsToCSV(filteredTransactions, filename);
  };

  return (
    <button
      className="btn btn--ghost btn--export"
      type="button"
      onClick={handleExport}
      title={`Export ${filteredTransactions.length} transaction(s) to CSV`}
    >
      ⬇ Export CSV ({filteredTransactions.length})
    </button>
  );
}
