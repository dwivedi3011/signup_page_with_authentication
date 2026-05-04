const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Add transaction
router.post("/", async (req, res) => {
  const { userId, type, amount, category } = req.body;

  const newTransaction = new Transaction({
    userId,
    type,
    amount,
    category
  });

  await newTransaction.save();
  res.json({ message: "Transaction added" });
});

// Get transactions
router.get("/:userId", async (req, res) => {
  const data = await Transaction.find({ userId: req.params.userId });
  res.json(data);
});

module.exports = router;
