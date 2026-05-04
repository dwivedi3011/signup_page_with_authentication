const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= SECRET =================
const SECRET = process.env.JWT_SECRET || "secret";

// ================= MODELS =================
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  email: String,
  password: String
}));

const Transaction = mongoose.model("Transaction", new mongoose.Schema({
  userId: String,
  amount: Number,
  type: String,
  category: String
}));

// ================= AUTH ROUTES =================

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Error in signup" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error in login" });
  }
});

// ================= TRANSACTION ROUTES =================

// Add transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    await tx.save();
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: "Error adding transaction" });
  }
});

// Get user transactions
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Delete transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
