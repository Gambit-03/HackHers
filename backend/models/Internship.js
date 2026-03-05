const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  company: String,
  role: String,
  domain: String,
  skillsRequired: [String],
  mode: String,
  duration: String,
  stipend: String,
});

module.exports = mongoose.model("Internship", internshipSchema);