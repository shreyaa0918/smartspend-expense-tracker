const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');
const { generateDueRecurringTransactions } = require('../services/recurringService');

function validateTransactionPayload(payload) {
  const { type, amount, category, date, notes, isRecurring, recurrenceFrequency } = payload;

  if (!type || !['income', 'expense'].includes(type)) {
    const err = new Error('Type must be either income or expense');
    err.statusCode = 400;
    throw err;
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    const err = new Error('Amount must be a number greater than 0');
    err.statusCode = 400;
    throw err;
  }

  if (!category || !category.trim()) {
    const err = new Error('Category is required');
    err.statusCode = 400;
    throw err;
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    const err = new Error('A valid transaction date is required');
    err.statusCode = 400;
    throw err;
  }

  if (notes && notes.length > 200) {
    const err = new Error('Notes cannot exceed 200 characters');
    err.statusCode = 400;
    throw err;
  }

  if (isRecurring && !['weekly', 'monthly'].includes(recurrenceFrequency)) {
    const err = new Error('Recurring transactions must have a frequency of weekly or monthly');
    err.statusCode = 400;
    throw err;
  }
}

const getTransactions = asyncHandler(async (req, res) => {
  // Auto-generate any overdue recurring instances on fetch
  await generateDueRecurringTransactions(req.user._id);

  const transactions = await Transaction.find({ userId: req.user._id }).sort({
    date: -1,
    createdAt: -1,
  });

  res.status(200).json({
    message: 'Transactions fetched successfully',
    data: transactions,
  });
});

const createTransaction = asyncHandler(async (req, res) => {
  validateTransactionPayload(req.body);

  const { type, amount, category, date, notes, isRecurring, recurrenceFrequency } = req.body;
  const recurring = Boolean(isRecurring);

  const transaction = await Transaction.create({
    userId: req.user._id,
    type,
    amount: Number(amount),
    category: category.trim(),
    date: new Date(date),
    notes: notes ? notes.trim() : '',
    isRecurring: recurring,
    recurrenceFrequency: recurring ? recurrenceFrequency : null,
    recurringParentId: null,
    lastGeneratedDate: null,
  });

  res.status(201).json({
    message: 'Transaction created successfully',
    data: transaction,
  });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid transaction id');
    err.statusCode = 400;
    throw err;
  }

  validateTransactionPayload(req.body);

  const { type, amount, category, date, notes, isRecurring, recurrenceFrequency } = req.body;
  const recurring = Boolean(isRecurring);

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    {
      type,
      amount: Number(amount),
      category: category.trim(),
      date: new Date(date),
      notes: notes ? notes.trim() : '',
      isRecurring: recurring,
      recurrenceFrequency: recurring ? recurrenceFrequency : null,
    },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    const err = new Error('Transaction not found');
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: 'Transaction updated successfully',
    data: transaction,
  });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid transaction id');
    err.statusCode = 400;
    throw err;
  }

  const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!transaction) {
    const err = new Error('Transaction not found');
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: 'Transaction deleted successfully',
    data: { id },
  });
});

/**
 * POST /api/transactions/generate-recurring
 * Manually trigger generation of due recurring transactions.
 * Useful for testing without waiting for the next fetch.
 */
const generateRecurring = asyncHandler(async (req, res) => {
  const created = await generateDueRecurringTransactions(req.user._id);
  res.status(200).json({
    message: `Generated ${created.length} recurring transaction(s)`,
    data: created,
  });
});

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  generateRecurring,
};
