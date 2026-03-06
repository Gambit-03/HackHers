const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: String,
  companyId: String,
  role: String,
  domain: String,
  skillsRequired: [String],
  mode: String,
  duration: String,
  stipend: String,
}, { timestamps: true });

module.exports = mongoose.model("Internship", internshipSchema);