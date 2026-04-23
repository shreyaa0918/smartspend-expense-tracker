const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '', maxlength: 200, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
