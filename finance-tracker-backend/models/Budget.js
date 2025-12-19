// C:\Users\joshu\FC\finance-tracker-backend\models\Budget.js

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },  // e.g. 2025
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
