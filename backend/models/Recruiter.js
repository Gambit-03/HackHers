const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyName: String,
  recruiterId: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Recruiter", recruiterSchema);