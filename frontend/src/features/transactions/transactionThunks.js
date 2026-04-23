import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTransactionRequest,
  deleteTransactionRequest,
  fetchTransactionsRequest,
  updateTransactionRequest
} from "../../api/transactionApi";

const extractData = (response) => response?.data || [];
const extractItem = (response) => response?.data || null;

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTransactionsRequest();
      return extractData(response);
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to fetch transactions.";
      return rejectWithValue(message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createTransactionRequest(payload);
      return extractItem(response);
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to create transaction.";
      return rejectWithValue(message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await updateTransactionRequest({ id, payload });
      return extractItem(response);
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to update transaction.";
      return rejectWithValue(message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTransactionRequest(id);
      return id;
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to delete transaction.";
      return rejectWithValue(message);
    }
  }
);
