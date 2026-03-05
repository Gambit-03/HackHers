const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    dob: { type: Date, required: true },
    role: {
      type: String,
      enum: ["admin", "recruiter", "student"],
      required: true,
    },
    aadhaarNumber: { type: String },
    aadhaarVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);