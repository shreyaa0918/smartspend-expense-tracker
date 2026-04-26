import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEditingTransaction,
  clearTransactionError,
} from "../../features/transactions/transactionSlice";
import {
  createTransaction,
  updateTransaction,
} from "../../features/transactions/transactionThunks";

const defaultForm = {
  type: "expense",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
  isRecurring: false,
  recurrenceFrequency: "monthly",
};

export default function TransactionForm() {
  const dispatch = useDispatch();
  const { editingTransaction, submitting, error } = useSelector((state) => state.transactions);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (!editingTransaction) {
      setFormData(defaultForm);
      return;
    }
    setFormData({
      type: editingTransaction.type,
      amount: editingTransaction.amount,
      category: editingTransaction.category,
      date: editingTransaction.date ? editingTransaction.date.slice(0, 10) : defaultForm.date,
      notes: editingTransaction.notes || "",
      isRecurring: editingTransaction.isRecurring || false,
      recurrenceFrequency: editingTransaction.recurrenceFrequency || "monthly",
    });
  }, [editingTransaction]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    dispatch(clearEditingTransaction());
    dispatch(clearTransactionError());
    setFormData(defaultForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount),
      // Only send frequency if recurring is checked
      recurrenceFrequency: formData.isRecurring ? formData.recurrenceFrequency : null,
    };

    if (editingTransaction?._id) {
      const result = await dispatch(
        updateTransaction({ id: editingTransaction._id, payload })
      );
      if (updateTransaction.fulfilled.match(result)) {
        resetForm();
      }
      return;
    }

    const result = await dispatch(createTransaction(payload));
    if (createTransaction.fulfilled.match(result)) {
      setFormData(defaultForm);
    }
  };

  return (
    <section className="transaction-card">
      <h2>{editingTransaction ? "Edit transaction" : "Add transaction"}</h2>
      <form className="transaction-form" onSubmit={onSubmit}>
        <select
          className="input-control"
          name="type"
          value={formData.type}
          onChange={onChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          className="input-control"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={formData.amount}
          onChange={onChange}
          required
        />

        <input
          className="input-control"
          name="category"
          type="text"
          placeholder="Category (e.g. Food, Salary)"
          value={formData.category}
          onChange={onChange}
          required
        />

        <input
          className="input-control"
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
          required
        />

        <textarea
          className="input-control"
          name="notes"
          maxLength={200}
          rows={2}
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={onChange}
        />

        {/* ── Recurring toggle ───────────────────────────────────── */}
        <label className="recurring-toggle">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={onChange}
          />
          <span>Recurring transaction</span>
        </label>

        {formData.isRecurring && (
          <select
            className="input-control"
            name="recurrenceFrequency"
            value={formData.recurrenceFrequency}
            onChange={onChange}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="transaction-form__actions">
          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingTransaction ? "Update" : "Add"}
          </button>
          {editingTransaction ? (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
