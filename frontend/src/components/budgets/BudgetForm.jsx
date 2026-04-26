import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearEditingBudget, clearBudgetError } from "../../features/budgets/budgetSlice";
import { createBudget, updateBudget } from "../../features/budgets/budgetThunks";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const defaultForm = {
  category: "",
  monthlyLimit: "",
  month: currentMonth(),
};

export default function BudgetForm() {
  const dispatch = useDispatch();
  const { editingBudget, submitting, error, selectedMonth } = useSelector(
    (state) => state.budgets
  );

  const [formData, setFormData] = useState({ ...defaultForm, month: selectedMonth });

  useEffect(() => {
    if (!editingBudget) {
      setFormData({ ...defaultForm, month: selectedMonth });
      return;
    }
    setFormData({
      category: editingBudget.category,
      monthlyLimit: editingBudget.monthlyLimit,
      month: editingBudget.month,
    });
  }, [editingBudget, selectedMonth]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    dispatch(clearEditingBudget());
    dispatch(clearBudgetError());
    setFormData({ ...defaultForm, month: selectedMonth });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      monthlyLimit: Number(formData.monthlyLimit),
    };

    if (editingBudget?._id) {
      const result = await dispatch(
        updateBudget({ id: editingBudget._id, payload: { monthlyLimit: payload.monthlyLimit } })
      );
      if (updateBudget.fulfilled.match(result)) {
        resetForm();
      }
      return;
    }

    const result = await dispatch(createBudget(payload));
    if (createBudget.fulfilled.match(result)) {
      setFormData({ ...defaultForm, month: selectedMonth });
    }
  };

  return (
    <section className="transaction-card">
      <h2>{editingBudget ? "Edit budget goal" : "Set budget goal"}</h2>
      <form className="transaction-form" onSubmit={onSubmit}>
        <input
          className="input-control"
          name="category"
          type="text"
          placeholder="Category (e.g. Food, Rent)"
          value={formData.category}
          onChange={onChange}
          required
          disabled={Boolean(editingBudget)} // category locked when editing
        />
        <input
          className="input-control"
          name="monthlyLimit"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Monthly limit ($)"
          value={formData.monthlyLimit}
          onChange={onChange}
          required
        />
        <input
          className="input-control"
          name="month"
          type="month"
          value={formData.month}
          onChange={onChange}
          required
          disabled={Boolean(editingBudget)}
        />

        {error ? <p className="form-error">{error}</p> : null}

        <div className="transaction-form__actions">
          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingBudget ? "Update" : "Set Goal"}
          </button>
          {editingBudget ? (
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
