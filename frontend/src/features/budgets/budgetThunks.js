import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBudgetsRequest,
  createBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,
} from "../../api/budgetApi";

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (month, { rejectWithValue }) => {
    try {
      const response = await fetchBudgetsRequest(month);
      return response?.data || [];
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to fetch budgets.";
      return rejectWithValue(message);
    }
  }
);

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createBudgetRequest(payload);
      return response?.data || null;
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to save budget.";
      return rejectWithValue(message);
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateBudgetRequest({ id, payload });
      return response?.data || null;
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to update budget.";
      return rejectWithValue(message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBudgetRequest(id);
      return id;
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to delete budget.";
      return rejectWithValue(message);
    }
  }
);
