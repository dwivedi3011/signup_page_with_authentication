const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request:", req.body);

    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in signup"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 🔑 Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in login"
    });
  }
});

module.exports = router;