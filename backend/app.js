// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes"); // 🔹 admin routes
const recruiterRoutes = require("./routes/recruiterRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// API routes
app.use("/api/auth", authRoutes);         // Auth: login/register
app.use("/api/students", studentRoutes); // Student dashboard APIs
app.use("/api/admin", adminRoutes);      // Admin dashboard APIs
app.use("/api/recruiter", recruiterRoutes);

module.exports = app;