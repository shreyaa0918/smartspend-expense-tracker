import api from "./axios";

export const fetchBudgetsRequest = async (month) => {
  const params = month ? { month } : {};
  const response = await api.get("/budgets", { params });
  return response.data;
};

export const createBudgetRequest = async (payload) => {
  const response = await api.post("/budgets", payload);
  return response.data;
};

export const updateBudgetRequest = async ({ id, payload }) => {
  const response = await api.put(`/budgets/${id}`, payload);
  return response.data;
};

export const deleteBudgetRequest = async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};
