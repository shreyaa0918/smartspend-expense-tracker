import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearEditingTransaction,
  clearTransactionError
} from "../../features/transactions/transactionSlice";
import {
  createTransaction,
  updateTransaction
} from "../../features/transactions/transactionThunks";

const defaultForm = {
  type: "expense",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  notes: ""
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
      notes: editingTransaction.notes || ""
    });
  }, [editingTransaction]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    dispatch(clearEditingTransaction());
    dispatch(clearTransactionError());
    setFormData(defaultForm);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (editingTransaction?._id) {
      const result = await dispatch(updateTransaction({ id: editingTransaction._id, payload }));
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
          rows={3}
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={onChange}
        />

        {error ? <p className="form-error">{error}</p> : null}

        <div className="transaction-form__actions">
          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingTransaction ? "Update" : "Add"}
          </button>
          {editingTransaction ? (
            <button className="btn btn--ghost" type="button" onClick={resetForm} disabled={submitting}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
