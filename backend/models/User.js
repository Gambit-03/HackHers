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
    isLoggedIn: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    aadhaarNumber: { type: String },
    aadhaarVerified: { type: Boolean, default: false },
    profile: {
      domain: { type: String, default: "" },
      skills: [{ type: String }],
      availability: {
        type: String,
        enum: ["remote", "offline", "hybrid"],
        default: "remote",
      },
      preferredDuration: { type: String, default: "" },
      experienceLevel: {
        type: String,
        enum: ["fresher", "intermediate", "advanced"],
        default: "fresher",
      },
    },
    profileDetails: {
      place: { type: String, default: "" },
      experience: { type: String, default: "" },
      fulltime: { type: Boolean, default: false },
      degree: { type: String, default: "" },
      college: { type: String, default: "" },
      year: { type: String, default: "" },
      cgpa: { type: String, default: "" },
      resumeName: { type: String, default: "" },
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);