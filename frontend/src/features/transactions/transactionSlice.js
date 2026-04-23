import { createSlice } from "@reduxjs/toolkit";
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction
} from "./transactionThunks";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  filters: {
    type: "all",
    category: "",
    startDate: "",
    endDate: ""
  },
  editingTransaction: null
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setEditingTransaction: (state, action) => {
      state.editingTransaction = action.payload;
    },
    clearEditingTransaction: (state) => {
      state.editingTransaction = null;
    },
    clearTransactionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load transactions.";
      })
      .addCase(createTransaction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to create transaction.";
      })
      .addCase(updateTransaction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.map((transaction) =>
          transaction._id === action.payload._id ? action.payload : transaction
        );
        state.editingTransaction = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to update transaction.";
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((transaction) => transaction._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to delete transaction.";
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setEditingTransaction,
  clearEditingTransaction,
  clearTransactionError
} = transactionSlice.actions;

export default transactionSlice.reducer;
