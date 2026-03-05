const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  sendAadhaarOtp,
  verifyAadhaarOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("mobile")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile must be 10 digits"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("dob").notEmpty().withMessage("DOB required"),
    body("role")
      .isIn(["admin", "student", "recruiter"])
      .withMessage("Invalid role"),
  ],
  register,
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  login,
);

// Aadhaar OTP
router.post("/send-aadhaar-otp", protect, sendAadhaarOtp);
router.post("/verify-aadhaar-otp", protect, verifyAadhaarOtp);

module.exports = router;
