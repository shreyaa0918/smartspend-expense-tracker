const Transaction = require('../models/Transaction');

/**
 * Given a frequency and a reference date, compute the next due date.
 */
function getNextDate(frequency, fromDate) {
  const d = new Date(fromDate);
  if (frequency === 'weekly') {
    d.setDate(d.getDate() + 7);
  } else if (frequency === 'monthly') {
    d.setMonth(d.getMonth() + 1);
  }
  return d;
}

/**
 * For a given user, look at all recurring template transactions and
 * generate any instances that are due up to today.
 * Returns the array of newly created transactions.
 */
async function generateDueRecurringTransactions(userId) {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // end of today

  // Find all active recurring templates owned by this user
  const templates = await Transaction.find({
    userId,
    isRecurring: true,
    recurringParentId: null, // only originals, not generated copies
    recurrenceFrequency: { $in: ['weekly', 'monthly'] },
  });

  const created = [];

  for (const template of templates) {
    // Determine the reference point: last generated date or the template's own date
    let cursor = template.lastGeneratedDate
      ? new Date(template.lastGeneratedDate)
      : new Date(template.date);

    let nextDue = getNextDate(template.recurrenceFrequency, cursor);

    // Generate all instances from nextDue up through today
    const instanceDates = [];
    while (nextDue <= today) {
      instanceDates.push(new Date(nextDue));
      nextDue = getNextDate(template.recurrenceFrequency, nextDue);
    }

    if (instanceDates.length === 0) continue;

    // Bulk-create all due instances
    const docs = instanceDates.map((d) => ({
      userId: template.userId,
      type: template.type,
      amount: template.amount,
      category: template.category,
      date: d,
      notes: template.notes,
      isRecurring: false,           // copies are NOT templates themselves
      recurrenceFrequency: null,
      recurringParentId: template._id,
      lastGeneratedDate: null,
    }));

    const newTransactions = await Transaction.insertMany(docs);
    created.push(...newTransactions);

    // Update the template's lastGeneratedDate to the most recent instance
    const lastDate = instanceDates[instanceDates.length - 1];
    await Transaction.findByIdAndUpdate(template._id, { lastGeneratedDate: lastDate });
  }

  return created;
}

module.exports = { generateDueRecurringTransactions };