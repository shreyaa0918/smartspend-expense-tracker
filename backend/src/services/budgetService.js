const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * Returns current "YYYY-MM" string for the server's local time.
 */
function currentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * For a given userId + month, aggregate total spending per category.
 * Returns a map: { [category]: totalSpent }
 */
async function getSpendingByCategory(userId, month) {
  // month = "YYYY-MM"
  const [year, monthNum] = month.split('-').map(Number);
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1); // exclusive

  const results = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        type: 'expense',
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: '$category',
        totalSpent: { $sum: '$amount' },
      },
    },
  ]);

  const map = {};
  for (const r of results) {
    map[r._id] = r.totalSpent;
  }
  return map;
}

async function getBudgets(userId, month) {
  const targetMonth = month || currentMonth();
  const budgets = await Budget.find({ userId, month: targetMonth }).sort({ category: 1 });
  const spendingMap = await getSpendingByCategory(userId, targetMonth);

  return budgets.map((b) => {
    const spent = spendingMap[b.category] || 0;
    return {
      _id: b._id,
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      month: b.month,
      spent,
      remaining: Math.max(0, b.monthlyLimit - spent),
      percentUsed: Math.round((spent / b.monthlyLimit) * 100),
      isOverBudget: spent > b.monthlyLimit,
    };
  });
}

async function createBudget(userId, { category, monthlyLimit, month }) {
  const targetMonth = month || currentMonth();

  // Upsert: if one already exists for this category+month, update it
  const budget = await Budget.findOneAndUpdate(
    { userId, category: category.trim(), month: targetMonth },
    { monthlyLimit: Number(monthlyLimit) },
    { new: true, upsert: true, runValidators: true }
  );

  const spendingMap = await getSpendingByCategory(userId, targetMonth);
  const spent = spendingMap[budget.category] || 0;

  return {
    _id: budget._id,
    category: budget.category,
    monthlyLimit: budget.monthlyLimit,
    month: budget.month,
    spent,
    remaining: Math.max(0, budget.monthlyLimit - spent),
    percentUsed: Math.round((spent / budget.monthlyLimit) * 100),
    isOverBudget: spent > budget.monthlyLimit,
  };
}

async function updateBudget(userId, budgetId, { monthlyLimit }) {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, userId },
    { monthlyLimit: Number(monthlyLimit) },
    { new: true, runValidators: true }
  );

  if (!budget) {
    const err = new Error('Budget not found');
    err.statusCode = 404;
    throw err;
  }

  const spendingMap = await getSpendingByCategory(userId, budget.month);
  const spent = spendingMap[budget.category] || 0;

  return {
    _id: budget._id,
    category: budget.category,
    monthlyLimit: budget.monthlyLimit,
    month: budget.month,
    spent,
    remaining: Math.max(0, budget.monthlyLimit - spent),
    percentUsed: Math.round((spent / budget.monthlyLimit) * 100),
    isOverBudget: spent > budget.monthlyLimit,
  };
}

async function deleteBudget(userId, budgetId) {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
  if (!budget) {
    const err = new Error('Budget not found');
    err.statusCode = 404;
    throw err;
  }
  return { id: budgetId };
}

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };