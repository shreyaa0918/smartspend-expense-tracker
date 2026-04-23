import React from "react";

export default function TransactionItem({ transaction, onEdit, onDelete, disabled }) {
  const formattedAmount = Number(transaction.amount).toFixed(2);
  const formattedDate = new Date(transaction.date).toLocaleDateString();

  return (
    <li className="transaction-item">
      <div>
        <p className="transaction-item__category">{transaction.category}</p>
        <p className="transaction-item__meta">
          {transaction.type} • {formattedDate}
        </p>
        {transaction.notes ? <p className="transaction-item__notes">{transaction.notes}</p> : null}
      </div>

      <div className="transaction-item__right">
        <p className={`transaction-item__amount transaction-item__amount--${transaction.type}`}>
          {transaction.type === "expense" ? "-" : "+"}${formattedAmount}
        </p>
        <div className="transaction-item__actions">
          <button
            type="button"
            className="btn btn--ghost btn--xs"
            onClick={() => onEdit(transaction)}
            disabled={disabled}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger btn--xs"
            onClick={() => onDelete(transaction._id)}
            disabled={disabled}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
