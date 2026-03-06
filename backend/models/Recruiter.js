const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  verifiedCompanies: [
    {
      companyName: { type: String, required: true },
      companyId: { type: String, required: true },
      industry: { type: String },
      location: { type: String },
      website: { type: String },
      description: { type: String },
      verifiedAt: { type: Date, default: Date.now },
    },
  ],
  companyName: { type: String },
  companyId: { type: String },
  industry: { type: String },
  location: { type: String },
  website: { type: String },
  description: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: { type: Date },
});

module.exports = mongoose.model("Recruiter", recruiterSchema);