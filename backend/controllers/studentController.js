const Student = require("../models/Student");
const Internship = require("../models/Internship");

exports.recommendInternships = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1️⃣ Save student preferences in MongoDB
    student.domain = req.body.domain;
    student.skills = req.body.skills;
    student.mode = req.body.mode;
    student.term = req.body.term;

    await student.save();

    // 2️⃣ Fetch all internships
    const internships = await Internship.find({});

    // 3️⃣ Match + Score
    const ranked = internships.map(intern => {
      let score = 0;

      if (intern.domain.toLowerCase() === student.domain.toLowerCase())
        score += 30;

      if (intern.mode.toLowerCase() === student.mode.toLowerCase())
        score += 20;

      if (intern.term.toLowerCase() === student.term.toLowerCase())
        score += 10;

      const matchedSkills = intern.skillsRequired.filter(skill =>
        student.skills.includes(skill.toLowerCase())
      );

      score += matchedSkills.length * 15;

      return { ...intern._doc, score };
    });

    // 4️⃣ Sort by score
    ranked.sort((a, b) => b.score - a.score);

    // 5️⃣ Return top 5
    res.json({
      topInternships: ranked.slice(0, 5)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};