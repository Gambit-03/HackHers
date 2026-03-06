const Recruiter = require("../models/Recruiter");
const Internship = require("../models/Internship");
const AppliedInternship = require("../models/AppliedInternship");

const normalizeStatus = (status) => {
  if (status === "applied") {
    return "pending";
  }
  if (status === "offer_received") {
    return "offer_extended";
  }
  return status || "pending";
};

const computeAiMatchScore = (application) => {
  const studentProfile = application.studentId?.profile || {};
  const studentSkills = Array.isArray(studentProfile.skills)
    ? studentProfile.skills.map((skill) => skill.toLowerCase())
    : [];
  const studentDomain = (studentProfile.domain || "").toLowerCase();
  const studentMode = (studentProfile.availability || "").toLowerCase();
  const studentDuration = (studentProfile.preferredDuration || "").toLowerCase();

  const internship = application.internshipId || {};
  const internshipSkills = Array.isArray(internship.skillsRequired)
    ? internship.skillsRequired.map((skill) => String(skill).toLowerCase())
    : [];
  const internshipDomain = (internship.domain || "").toLowerCase();
  const internshipMode = (internship.mode || "").toLowerCase();
  const internshipDuration = (internship.duration || "").toLowerCase();

  let score = 0;

  if (studentDomain && internshipDomain && studentDomain === internshipDomain) {
    score += 30;
  }

  if (internshipSkills.length > 0) {
    const matchingSkills = internshipSkills.filter((skill) => studentSkills.includes(skill)).length;
    score += Math.round((matchingSkills / internshipSkills.length) * 40);
  }

  if (studentMode && internshipMode && studentMode === internshipMode) {
    score += 15;
  }

  if (studentDuration && internshipDuration && studentDuration === internshipDuration) {
    score += 15;
  }

  return Math.max(0, Math.min(100, score));
};

const COMPANY_CATALOG = [
  { companyId: "CMP-1001", companyName: "Data Corp", industry: "Data & Analytics", location: "Bengaluru", website: "https://datacorp.example" },
  { companyId: "CMP-1002", companyName: "AI Spark", industry: "Artificial Intelligence", location: "Hyderabad", website: "https://aispark.example" },
  { companyId: "CMP-1003", companyName: "Cloud Orbit", industry: "Cloud Services", location: "Pune", website: "https://cloudorbit.example" },
  { companyId: "CMP-1004", companyName: "Fin Nova", industry: "FinTech", location: "Mumbai", website: "https://finnova.example" },
  { companyId: "CMP-1005", companyName: "Green Grid", industry: "Energy Tech", location: "Chennai", website: "https://greengrid.example" },
  { companyId: "CMP-1006", companyName: "Cyber Shield", industry: "Cybersecurity", location: "Noida", website: "https://cybershield.example" },
  { companyId: "CMP-1007", companyName: "Health Sync", industry: "HealthTech", location: "Delhi", website: "https://healthsync.example" },
  { companyId: "CMP-1008", companyName: "Robo Dynamics", industry: "Robotics", location: "Ahmedabad", website: "https://robodynamics.example" },
  { companyId: "CMP-1009", companyName: "Pixel Works", industry: "Design & Product", location: "Jaipur", website: "https://pixelworks.example" },
  { companyId: "CMP-1010", companyName: "Logi Chain", industry: "Supply Chain", location: "Kolkata", website: "https://logichain.example" },
  { companyId: "CMP-1011", companyName: "Skill Forge", industry: "EdTech", location: "Lucknow", website: "https://skillforge.example" },
  { companyId: "CMP-1012", companyName: "Mobility One", industry: "Automotive Tech", location: "Coimbatore", website: "https://mobilityone.example" },
];

exports.getCompanyCatalog = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "4", 10), 1);
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    companies: COMPANY_CATALOG.slice(start, end),
    pagination: {
      page,
      limit,
      total: COMPANY_CATALOG.length,
      totalPages: Math.ceil(COMPANY_CATALOG.length / limit),
    },
  });
};

exports.getMyRecruiterProfile = async (req, res) => {
  const recruiter = await Recruiter.findOne({ userId: req.user.id });
  res.json({ recruiter });
};

exports.verifyRecruiter = async (req, res) => {
  try {
    const { companyId } = req.body;
    const selectedCompany = COMPANY_CATALOG.find((item) => item.companyId === companyId);

    if (!selectedCompany) {
      return res.status(400).json({ message: "Invalid company selection" });
    }

    let recruiter = await Recruiter.findOne({ userId: req.user.id });

    if (!recruiter) {
      recruiter = new Recruiter({ userId: req.user.id });
    }

    if (!Array.isArray(recruiter.verifiedCompanies)) {
      recruiter.verifiedCompanies = [];
    }

    const verifiedEntry = {
      companyName: selectedCompany.companyName,
      companyId: selectedCompany.companyId,
      industry: selectedCompany.industry,
      location: selectedCompany.location,
      website: selectedCompany.website,
      description: `Recruiter verified for ${selectedCompany.companyName}`,
      verifiedAt: new Date(),
    };

    const existingCompanyIndex = recruiter.verifiedCompanies.findIndex(
      (item) => item.companyId === selectedCompany.companyId
    );

    if (existingCompanyIndex >= 0) {
      recruiter.verifiedCompanies[existingCompanyIndex] = verifiedEntry;
    } else {
      recruiter.verifiedCompanies.push(verifiedEntry);
    }

    recruiter.companyName = verifiedEntry.companyName;
    recruiter.companyId = verifiedEntry.companyId;
    recruiter.industry = verifiedEntry.industry;
    recruiter.location = verifiedEntry.location;
    recruiter.website = verifiedEntry.website;
    recruiter.description = verifiedEntry.description;
    recruiter.isVerified = true;
    recruiter.verifiedAt = verifiedEntry.verifiedAt;

    await recruiter.save();

    res.json({ message: "Verified Successfully", recruiter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postInternship = async (req, res) => {
  try {
    const {
      role,
      domain,
      skillsRequired,
      stipend,
      mode,
      duration,
      companyName,
      companyId,
    } = req.body;

    const recruiter = await Recruiter.findOne({ userId: req.user.id, isVerified: true });
    if (!recruiter) {
      return res.status(403).json({ message: "Verify profile before posting internships" });
    }

    if (!companyName || !companyId) {
      return res.status(400).json({ message: "Company name and company ID are required" });
    }

    const verifiedCompanies = Array.isArray(recruiter.verifiedCompanies) && recruiter.verifiedCompanies.length > 0
      ? recruiter.verifiedCompanies
      : [{
          companyName: recruiter.companyName,
          companyId: recruiter.companyId,
          industry: recruiter.industry,
          location: recruiter.location,
          website: recruiter.website,
          description: recruiter.description,
          verifiedAt: recruiter.verifiedAt,
        }];

    const requestedCompanyId = companyId.trim().toUpperCase();
    const requestedCompanyName = companyName.trim().toLowerCase();

    const matchedCompany = verifiedCompanies.find(
      (item) =>
        item.companyId?.toUpperCase() === requestedCompanyId &&
        item.companyName?.toLowerCase().trim() === requestedCompanyName
    );

    if (!matchedCompany) {
      return res.status(403).json({
        message: "Only your verified company name and company ID pair can post internships",
      });
    }

    const internship = new Internship({
      recruiter: req.user.id,
      company: matchedCompany.companyName,
      companyId: matchedCompany.companyId,
      role,
      domain,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      stipend,
      mode,
      duration,
    });

    await internship.save();

    res.json({ message: "Internship Posted", internship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const internships = await Internship.find({ recruiter: req.user.id }).select(
      "_id role company companyId domain skillsRequired mode duration"
    );
    const internshipIds = internships.map((item) => item._id);

    if (internshipIds.length === 0) {
      return res.json({
        metrics: {
          totalApplications: 0,
          pendingReview: 0,
          shortlistedOrInterviewing: 0,
          rejected: 0,
          offerExtended: 0,
          hired: 0,
          declinedByStudent: 0,
          offerAcceptanceRate: 0,
        },
        applications: [],
      });
    }

    const applications = await AppliedInternship.find({ internshipId: { $in: internshipIds } })
      .populate("studentId", "name email profile profileDetails")
      .populate("internshipId", "role company companyId domain skillsRequired mode duration recruiter")
      .sort({ createdAt: -1 });

    const normalizedApplications = applications.map((application) => {
      const normalizedStatus = normalizeStatus(application.status);
      const aiMatchScore = computeAiMatchScore(application);

      const studentPlace = application.studentId?.profileDetails?.place || "";
      const educationLevel = application.studentId?.profileDetails?.degree || "";
      const studentSkills = Array.isArray(application.studentId?.profile?.skills)
        ? application.studentId.profile.skills
        : [];

      return {
        _id: application._id,
        internshipId: application.internshipId,
        internshipTitle: application.internshipId?.role || application.internshipTitle || "-",
        companyName: application.internshipId?.company || application.companyName || "-",
        companyId: application.internshipId?.companyId || "-",
        studentId: application.studentId,
        applicantName: application.studentId?.name || "Unknown",
        applicantEmail: application.studentId?.email || "-",
        status: normalizedStatus,
        offerDetails: application.offerDetails || null,
        aiMatchScore,
        location: studentPlace,
        educationLevel,
        skills: studentSkills,
        createdAt: application.createdAt,
      };
    });

    const minScore = Number(req.query.minScore || 0);
    const statusFilter = (req.query.status || "").toLowerCase();
    const locationFilter = (req.query.location || "").toLowerCase();
    const educationFilter = (req.query.educationLevel || "").toLowerCase();
    const skillFilter = (req.query.skill || "").toLowerCase();
    const search = (req.query.search || "").toLowerCase();

    const filteredApplications = normalizedApplications.filter((item) => {
      const scoreOk = Number.isNaN(minScore) ? true : item.aiMatchScore >= minScore;
      const statusOk = !statusFilter || item.status === statusFilter;
      const locationOk = !locationFilter || (item.location || "").toLowerCase().includes(locationFilter);
      const educationOk = !educationFilter || (item.educationLevel || "").toLowerCase().includes(educationFilter);
      const skillOk =
        !skillFilter ||
        item.skills.some((skill) => String(skill).toLowerCase().includes(skillFilter));
      const searchOk =
        !search ||
        item.applicantName.toLowerCase().includes(search) ||
        item.applicantEmail.toLowerCase().includes(search);

      return scoreOk && statusOk && locationOk && educationOk && skillOk && searchOk;
    });

    const metrics = {
      totalApplications: filteredApplications.length,
      pendingReview: filteredApplications.filter((item) => item.status === "pending").length,
      shortlistedOrInterviewing: filteredApplications.filter(
        (item) => item.status === "shortlisted" || item.status === "interviewing"
      ).length,
      rejected: filteredApplications.filter((item) => item.status === "rejected").length,
    };

    metrics.offerExtended = filteredApplications.filter((item) => item.status === "offer_extended").length;
    metrics.hired = filteredApplications.filter((item) => item.status === "hired").length;
    metrics.declinedByStudent = filteredApplications.filter((item) => item.status === "declined_by_student").length;

    const totalOfferDecisions = metrics.offerExtended + metrics.hired + metrics.declinedByStudent;
    metrics.offerAcceptanceRate = totalOfferDecisions > 0
      ? Math.round((metrics.hired / totalOfferDecisions) * 100)
      : 0;

    res.json({ metrics, applications: filteredApplications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "interviewing",
      "rejected",
      "offer_extended",
      "offer_received",
      "hired",
      "declined_by_student",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await AppliedInternship.findById(applicationId).populate("internshipId", "recruiter");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const recruiterMatchesDirect = application.recruiterId && application.recruiterId.toString() === req.user.id;
    const recruiterMatchesInternship = application.internshipId?.recruiter?.toString() === req.user.id;

    if (!recruiterMatchesDirect && !recruiterMatchesInternship) {
      return res.status(403).json({ message: "Not allowed to update this application" });
    }

    application.status = status;
    if (!application.recruiterId) {
      application.recruiterId = req.user.id;
    }
    await application.save();

    res.json({ message: "Application status updated", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.extendOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { startDate, endDate, stipendAmount, mode } = req.body;

    if (!startDate || !endDate || !mode) {
      return res.status(400).json({ message: "Start date, end date and mode are required" });
    }

    const application = await AppliedInternship.findById(applicationId).populate(
      "internshipId",
      "recruiter"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const recruiterMatchesDirect = application.recruiterId && application.recruiterId.toString() === req.user.id;
    const recruiterMatchesInternship = application.internshipId?.recruiter?.toString() === req.user.id;

    if (!recruiterMatchesDirect && !recruiterMatchesInternship) {
      return res.status(403).json({ message: "Not allowed to extend offer for this application" });
    }

    if (application.status !== "shortlisted") {
      return res.status(400).json({ message: "Only shortlisted candidates can receive an offer" });
    }

    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime()) || parsedEnd < parsedStart) {
      return res.status(400).json({ message: "Please provide a valid date range" });
    }

    application.status = "offer_extended";
    application.offerDetails = {
      startDate: parsedStart,
      endDate: parsedEnd,
      stipendAmount: stipendAmount || "",
      mode,
      offerLetterPath: req.file ? `/uploads/offer-letters/${req.file.filename}` : (application.offerDetails?.offerLetterPath || ""),
      offerLetterName: req.file ? req.file.originalname : (application.offerDetails?.offerLetterName || ""),
      offeredAt: new Date(),
    };

    if (!application.recruiterId) {
      application.recruiterId = req.user.id;
    }

    await application.save();

    res.json({ message: "Offer extended successfully", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.selectStudent = async (req, res) => {
  try {
    const { internshipId, studentId } = req.params;

    const application = await AppliedInternship.findOne({ internshipId, studentId, recruiterId: req.user.id });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "shortlisted";
    await application.save();

    res.json({ message: "Student shortlisted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
