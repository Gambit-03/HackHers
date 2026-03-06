const User = require("../models/User");
const AppliedInternship = require("../models/AppliedInternship");
const Internship = require("../models/Internship");

const normalize = (value = "") => value.toString().trim().toLowerCase();

const toSkillArray = (skillsInput) => {
  if (Array.isArray(skillsInput)) {
    return skillsInput.map((s) => normalize(s)).filter(Boolean);
  }

  return normalize(skillsInput)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

exports.getDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-otp -otpExpires -__v");

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.recommendInternships = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const normalizedProfile = {
      domain: req.body.domain || "",
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : (req.body.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      availability: (req.body.mode || "remote").toLowerCase(),
      preferredDuration: req.body.duration || "",
      experienceLevel: (req.body.experienceLevel || "fresher").toLowerCase(),
    };

    // Save submitted preference profile in MongoDB.
    student.profile = normalizedProfile;
    await student.save();

    const internships = await Internship.find({}).sort({ createdAt: -1 });

    const userDomain = normalize(normalizedProfile.domain);
    const userSkills = toSkillArray(normalizedProfile.skills);
    const userAvailability = normalize(normalizedProfile.availability);
    const userDuration = normalize(normalizedProfile.preferredDuration);
    const userExperience = normalize(normalizedProfile.experienceLevel);

    const ranked = internships.map((internship) => {
      const internshipDomain = normalize(internship.domain);
      const internshipSkills = toSkillArray(internship.skillsRequired || []);
      const internshipAvailability = normalize(internship.mode);
      const internshipDuration = normalize(internship.duration);

      const criteriaScores = {
        domain: internshipDomain && internshipDomain === userDomain ? 30 : 0,
        skills: 0,
        availability: internshipAvailability && internshipAvailability === userAvailability ? 15 : 0,
        duration: internshipDuration && internshipDuration === userDuration ? 15 : 0,
      };

      const matchedSkills = internshipSkills.filter((skill) => userSkills.includes(skill));
      criteriaScores.skills = internshipSkills.length > 0
        ? Math.round((matchedSkills.length / internshipSkills.length) * 40)
        : 0;

      const experienceBonus = userExperience && matchedSkills.length >= 3 ? 5 : 0;

      const totalScore = Math.min(
        100,
        criteriaScores.domain +
        criteriaScores.skills +
        criteriaScores.availability +
        criteriaScores.duration +
        experienceBonus
      );

      return {
        id: internship._id,
        title: internship.role,
        company: internship.company,
        companyId: internship.companyId,
        domain: internship.domain,
        skillsRequired: internship.skillsRequired || [],
        mode: internship.mode,
        duration: internship.duration,
        stipend: internship.stipend,
        criteriaScores,
        matchedSkills,
        totalScore,
      };
    }).sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    res.json({
      topInternships: ranked.slice(0, 10),
      savedProfile: student.profile,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyInternship = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const { internshipTitle, companyName } = req.body;
    if (!internshipTitle || !companyName) {
      return res.status(400).json({ message: "Internship title and company are required" });
    }

    const existing = await AppliedInternship.findOne({
      studentId: req.user.id,
      internshipTitle,
      companyName,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this internship" });
    }

    const internship = await Internship.findOne({
      role: internshipTitle,
      company: companyName,
    }).select("_id recruiter");

    const application = await AppliedInternship.create({
      studentId: req.user.id,
      recruiterId: internship?.recruiter,
      internshipId: internship?._id,
      internshipTitle,
      companyName,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyOffers = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const offers = await AppliedInternship.find({
      studentId: req.user.id,
      status: { $in: ["offer_extended", "offer_received", "hired"] },
    })
      .populate("internshipId", "role company companyId")
      .sort({ updatedAt: -1 });

    const transformed = offers.map((item) => ({
      id: item._id,
      status: item.status === "offer_received" ? "offer_extended" : item.status,
      companyName: item.internshipId?.company || item.companyName,
      companyId: item.internshipId?.companyId || "",
      role: item.internshipId?.role || item.internshipTitle,
      offerDetails: item.offerDetails || {},
      updatedAt: item.updatedAt,
    }));

    const pendingOffers = transformed.filter((item) => item.status === "offer_extended");

    res.json({
      pendingOfferCount: pendingOffers.length,
      latestPendingOffer: pendingOffers[0] || null,
      offers: transformed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.respondToOffer = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const { offerId } = req.params;
    const { decision } = req.body;

    if (!["accept", "decline"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be accept or decline" });
    }

    const offer = await AppliedInternship.findOne({ _id: offerId, studentId: req.user.id });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.status !== "offer_extended") {
      return res.status(400).json({ message: "Offer is no longer active" });
    }

    offer.status = decision === "accept" ? "hired" : "declined_by_student";
    await offer.save();

    res.json({ message: decision === "accept" ? "Offer accepted" : "Offer declined", offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};