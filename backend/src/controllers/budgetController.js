const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../services/budgetService');
const { validateBudgetInput, validateMonthParam } = require('../validations/budgetValidation');

const getBudgetsController = asyncHandler(async (req, res) => {
  const { month } = req.query;
  validateMonthParam(month);
  const budgets = await getBudgets(req.user._id, month);
  res.status(200).json({ message: 'Budgets fetched successfully', data: budgets });
});

const createBudgetController = asyncHandler(async (req, res) => {
  validateBudgetInput(req.body);
  validateMonthParam(req.body.month);
  const budget = await createBudget(req.user._id, req.body);
  res.status(201).json({ message: 'Budget saved successfully', data: budget });
});

const updateBudgetController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid budget id');
    err.statusCode = 400;
    throw err;
  }
  const { monthlyLimit } = req.body;
  const limit = Number(monthlyLimit);
  if (!Number.isFinite(limit) || limit <= 0) {
    const err = new Error('Monthly limit must be a number greater than 0');
    err.statusCode = 400;
    throw err;
  }
  const budget = await updateBudget(req.user._id, id, { monthlyLimit });
  res.status(200).json({ message: 'Budget updated successfully', data: budget });
});

const deleteBudgetController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid budget id');
    err.statusCode = 400;
    throw err;
  }
  const result = await deleteBudget(req.user._id, id);
  res.status(200).json({ message: 'Budget deleted successfully', data: result });
});

module.exports = {
  getBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
};
