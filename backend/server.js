const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

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

// ================= AUTH MIDDLEWARE =================
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// ================= SERVE FRONTEND =================

// serve all frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// default route → open login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login/index.html"));
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
