import api from "./axios";

export const fetchTransactionsRequest = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const createTransactionRequest = async (payload) => {
  const response = await api.post("/transactions", payload);
  return response.data;
};

export const updateTransactionRequest = async ({ id, payload }) => {
  const response = await api.put(`/transactions/${id}`, payload);
  return response.data;
};

export const deleteTransactionRequest = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};
