const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  domain: String,
  skills: [String],
  mode: {
    type: String,
    enum: ["Remote", "Onsite", "Hybrid"],
    default: "Remote",
  },
  term: String,
});

module.exports = mongoose.model("Student", studentSchema);