const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

function validateTransactionPayload(payload) {
  const { type, amount, category, date, notes } = payload;

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
}

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
  res.status(200).json({
    message: 'Transactions fetched successfully',
    data: transactions,
  });
});

const createTransaction = asyncHandler(async (req, res) => {
  validateTransactionPayload(req.body);

  const transaction = await Transaction.create({
    userId: req.user._id,
    type: req.body.type,
    amount: Number(req.body.amount),
    category: req.body.category.trim(),
    date: new Date(req.body.date),
    notes: req.body.notes ? req.body.notes.trim() : '',
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

  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    {
      type: req.body.type,
      amount: Number(req.body.amount),
      category: req.body.category.trim(),
      date: new Date(req.body.date),
      notes: req.body.notes ? req.body.notes.trim() : '',
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

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
