import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "./budgetThunks";

// Returns current month as "YYYY-MM"
function currentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  selectedMonth: currentMonth(),
  editingBudget: null,
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setEditingBudget: (state, action) => {
      state.editingBudget = action.payload;
    },
    clearEditingBudget: (state) => {
      state.editingBudget = null;
    },
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBudgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load budgets.";
      })

      // createBudget
      .addCase(createBudget.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.submitting = false;
        // Upsert: replace if same category+month exists, else prepend
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to save budget.";
      })

      // updateBudget
      .addCase(updateBudget.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.editingBudget = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to update budget.";
      })

      // deleteBudget
      .addCase(deleteBudget.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to delete budget.";
      });
  },
});

export const {
  setSelectedMonth,
  setEditingBudget,
  clearEditingBudget,
  clearBudgetError,
} = budgetSlice.actions;

export default budgetSlice.reducer;
