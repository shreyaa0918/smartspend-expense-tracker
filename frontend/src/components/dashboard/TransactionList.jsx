import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditingTransaction
} from "../../features/transactions/transactionSlice";
import { deleteTransaction } from "../../features/transactions/transactionThunks";
import TransactionItem from "./TransactionItem";

function inDateRange(transactionDate, startDate, endDate) {
  const value = new Date(transactionDate).getTime();
  if (startDate) {
    const start = new Date(startDate).getTime();
    if (value < start) {
      return false;
    }
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    if (value > end) {
      return false;
    }
  }
  return true;
}

export default function TransactionList({ mode = "filtered", limit = null }) {
  const dispatch = useDispatch();
  const { items, filters, loading, submitting } = useSelector((state) => state.transactions);

  const filteredTransactions = useMemo(() => {
    if (mode === "recent") {
      const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
      return limit ? sorted.slice(0, limit) : sorted;
    }

    return items.filter((transaction) => {
      const typeMatch = filters.type === "all" || transaction.type === filters.type;
      const categoryMatch = filters.category
        ? transaction.category.toLowerCase().includes(filters.category.toLowerCase())
        : true;
      const dateMatch = inDateRange(transaction.date, filters.startDate, filters.endDate);
      return typeMatch && categoryMatch && dateMatch;
    });
  }, [items, filters, mode, limit]);

  const onDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  if (loading) {
    return <p className="dashboard-status">Loading transactions...</p>;
  }

  if (!filteredTransactions.length) {
    return (
      <p className="dashboard-status">
        {mode === "recent" ? "No recent transactions yet." : "No transactions found for current filters."}
      </p>
    );
  }

  return (
    <ul className="transaction-list">
      {filteredTransactions.map((transaction) => (
        <TransactionItem
          key={transaction._id}
          transaction={transaction}
          onEdit={(item) => dispatch(setEditingTransaction(item))}
          onDelete={onDelete}
          disabled={submitting}
        />
      ))}
    </ul>
  );
}
