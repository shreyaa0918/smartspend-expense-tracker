function validateBudgetInput({ category, monthlyLimit }) {
  if (!category || !category.trim()) {
    const err = new Error('Category is required');
    err.statusCode = 400;
    throw err;
  }

  const limit = Number(monthlyLimit);
  if (!Number.isFinite(limit) || limit <= 0) {
    const err = new Error('Monthly limit must be a number greater than 0');
    err.statusCode = 400;
    throw err;
  }
}

function validateMonthParam(month) {
  if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    const err = new Error('Month must be in YYYY-MM format');
    err.statusCode = 400;
    throw err;
  }
}

module.exports = { validateBudgetInput, validateMonthParam };