const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// MongoDB connection
mongoose.connect("mongodb+srv://siddwivedi3011:Raja%407521@siddhant1.qwieqhn.mongodb.net/?retryWrites=true&w=majority&appName=siddhant1")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 🔐 Auth Middleware
function authMiddleware(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// 🔒 Protected route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.send("Welcome to dashboard 🔐");
});

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});