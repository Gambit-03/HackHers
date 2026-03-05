const Recruiter = require("../models/Recruiter");
const Internship = require("../models/Internship");

/* ==========================
   1. Verify Recruiter
========================== */
exports.verifyRecruiter = async (req, res) => {
  try {
    const { companyName, recruiterId } = req.body;

    let recruiter = await Recruiter.findOne({ userId: req.user.id });

    if (!recruiter) {
      recruiter = new Recruiter({
        userId: req.user.id,
        companyName,
        recruiterId,
        isVerified: true,
      });
    } else {
      recruiter.companyName = companyName;
      recruiter.recruiterId = recruiterId;
      recruiter.isVerified = true;
    }

    await recruiter.save();

    res.json({ message: "Verified Successfully", recruiter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================
   2. Post Internship
========================== */
exports.postInternship = async (req, res) => {
  try {
    const { role, skills, experience, stipend, mode, timePeriod } = req.body;

    const internship = new Internship({
      recruiter: req.user.id,
      role,
      skills,
      experience,
      stipend,
      mode,
      timePeriod,
    });

    await internship.save();

    res.json({ message: "Internship Posted", internship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================
   3. Get Applications
========================== */
exports.getApplications = async (req, res) => {
  try {
    const internships = await Internship.find({ recruiter: req.user.id })
      .populate("applicants", "name email");

    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================
   4. Select Student
========================== */
exports.selectStudent = async (req, res) => {
  try {
    const { internshipId, studentId } = req.params;

    const internship = await Internship.findById(internshipId);

    internship.selectedStudent = studentId;
    await internship.save();

    res.json({ message: "Student Selected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};