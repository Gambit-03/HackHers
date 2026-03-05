const Internship = require("../models/Internship");
const Student = require("../models/Student");

exports.recommendInternships = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1️⃣ Update student preferences
    student.domain = req.body.domain;
    student.skills = req.body.skills;
    student.mode = req.body.mode;
    student.term = req.body.term;

    await student.save();

    // 2️⃣ Fetch internships from MongoDB
    const internships = await Internship.find({
      domain: student.domain,
      mode: student.mode,
      term: student.term,
    });

    // 3️⃣ Match skills
    const matchedInternships = internships.map((intern) => {
      const matchedSkills = intern.skillsRequired.filter((skill) =>
        student.skills.includes(skill)
      );

      return {
        ...intern._doc,
        matchScore: matchedSkills.length,
      };
    });

    // 4️⃣ Sort by matchScore
    matchedInternships.sort((a, b) => b.matchScore - a.matchScore);

    // 5️⃣ Return top 5
    res.json({
      topInternships: matchedInternships.slice(0, 5),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};