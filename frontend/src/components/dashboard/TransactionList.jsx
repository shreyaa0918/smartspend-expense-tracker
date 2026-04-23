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

export default function TransactionList() {
  const dispatch = useDispatch();
  const { items, filters, loading, submitting } = useSelector((state) => state.transactions);

  const filteredTransactions = useMemo(() => {
    return items.filter((transaction) => {
      const typeMatch = filters.type === "all" || transaction.type === filters.type;
      const categoryMatch = filters.category
        ? transaction.category.toLowerCase().includes(filters.category.toLowerCase())
        : true;
      const dateMatch = inDateRange(transaction.date, filters.startDate, filters.endDate);
      return typeMatch && categoryMatch && dateMatch;
    });
  }, [items, filters]);

  const onDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  if (loading) {
    return <p className="dashboard-status">Loading transactions...</p>;
  }

  if (!filteredTransactions.length) {
    return <p className="dashboard-status">No transactions found for current filters.</p>;
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
