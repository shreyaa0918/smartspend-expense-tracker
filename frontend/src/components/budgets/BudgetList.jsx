import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditingBudget, setSelectedMonth } from "../../features/budgets/budgetSlice";
import { deleteBudget, fetchBudgets } from "../../features/budgets/budgetThunks";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function ProgressBar({ percent, isOver }) {
  const clamped = Math.min(percent, 100);
  const color = isOver
    ? "#b91c1c"
    : percent >= 80
    ? "#f59e0b"
    : "#22c55e";

  return (
    <div className="budget-progress-track">
      <div
        className="budget-progress-fill"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export default function BudgetList() {
  const dispatch = useDispatch();
  const { items, loading, submitting, selectedMonth } = useSelector((state) => state.budgets);

  useEffect(() => {
    dispatch(fetchBudgets(selectedMonth));
  }, [dispatch, selectedMonth]);

  const onMonthChange = (e) => {
    dispatch(setSelectedMonth(e.target.value));
  };

  const onDelete = (id) => {
    dispatch(deleteBudget(id));
  };

  return (
    <section className="transaction-card">
      <div className="budget-list-header">
        <h2>Budget goals</h2>
        <input
          className="input-control budget-month-picker"
          type="month"
          value={selectedMonth}
          onChange={onMonthChange}
        />
      </div>

      {loading ? (
        <p className="dashboard-status">Loading budgets...</p>
      ) : items.length === 0 ? (
        <p className="dashboard-status">No budget goals set for this month.</p>
      ) : (
        <ul className="budget-list">
          {items.map((budget) => (
            <li
              key={budget._id}
              className={`budget-item ${budget.isOverBudget ? "budget-item--over" : ""}`}
            >
              <div className="budget-item__top">
                <span className="budget-item__category">{budget.category}</span>
                {budget.isOverBudget && (
                  <span className="budget-item__alert">⚠ Over budget!</span>
                )}
              </div>

              <ProgressBar percent={budget.percentUsed} isOver={budget.isOverBudget} />

              <div className="budget-item__stats">
                <span>
                  {formatCurrency(budget.spent)} spent of {formatCurrency(budget.monthlyLimit)}
                </span>
                <span className={budget.isOverBudget ? "budget-over-text" : "budget-ok-text"}>
                  {budget.isOverBudget
                    ? `${formatCurrency(budget.spent - budget.monthlyLimit)} over`
                    : `${formatCurrency(budget.remaining)} left`}
                </span>
              </div>

              <div className="transaction-item__actions">
                <button
                  className="btn btn--ghost btn--xs"
                  type="button"
                  onClick={() => dispatch(setEditingBudget(budget))}
                  disabled={submitting}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--xs"
                  type="button"
                  onClick={() => onDelete(budget._id)}
                  disabled={submitting}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
