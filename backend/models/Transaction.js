// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // "income" or "expense"
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);