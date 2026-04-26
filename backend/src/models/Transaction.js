const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '', maxlength: 200, trim: true },

    // ── Recurring fields ──────────────────────────────────────────────────────
    isRecurring: { type: Boolean, default: false },
    recurrenceFrequency: {
      type: String,
      enum: ['weekly', 'monthly', null],
      default: null,
    },
    // The "template" transaction that spawned this one (null for originals)
    recurringParentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    // Last date we generated a child from this template
    lastGeneratedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);