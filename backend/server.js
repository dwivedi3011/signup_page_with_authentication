const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const SECRET = process.env.JWT_SECRET || "secret";

// Auth Middleware
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

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});