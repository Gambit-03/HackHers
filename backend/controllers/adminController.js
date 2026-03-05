const AppliedInternship = require("../models/AppliedInternship");
const Student = require("../models/Student");
const Internship = require("../models/Internship");
const PDFDocument = require("pdfkit");

exports.getAnalytics = async (req, res) => {
  const currentUsers = await Student.countDocuments({ isLoggedIn: true });
  const appliedInternships = await AppliedInternship.countDocuments();
  const totalInternships = await Internship.countDocuments();
  const placedStudents = await Student.countDocuments({ placed: true });

  res.json({ currentUsers, appliedInternships, totalInternships, placedStudents });
};

exports.getRecruiters = async (req, res) => {
  // Fetch verified recruiters
  const recruiters = await Student.find({ role: "recruiter", verified: true });
  res.json(recruiters);
};

exports.getCompanies = async (req, res) => {
  const companies = await Internship.distinct("company");
  res.json(companies);
};

exports.downloadReport = async (req, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=report-${req.params.id}.pdf`);
  doc.text("Report for ID: " + req.params.id);
  doc.end();
  doc.pipe(res);
};