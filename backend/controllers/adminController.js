const AppliedInternship = require("../models/AppliedInternship");
const Internship = require("../models/Internship");
const Recruiter = require("../models/Recruiter");
const User = require("../models/User");
const PDFDocument = require("pdfkit");

const normalizeStatus = (status) => {
  if (status === "applied") return "pending";
  if (status === "offer_received") return "offer_extended";
  return status || "pending";
};

const ensureSpace = (doc, neededHeight = 30) => {
  if (doc.y + neededHeight > doc.page.height - 60) {
    doc.addPage();
  }
};

const startPdfResponse = (res, fileName) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  doc.pipe(res);
  return doc;
};

const getApplicationRows = async () => {
  const applications = await AppliedInternship.find({})
    .populate("studentId", "name email")
    .populate("recruiterId", "name email")
    .populate({
      path: "internshipId",
      select: "role company companyId recruiter mode duration stipend",
      populate: { path: "recruiter", select: "name email" },
    })
    .sort({ createdAt: -1 });

  return applications.map((application) => {
    const normalizedStatus = normalizeStatus(application.status);
    const internship = application.internshipId;
    const recruiterFromInternship = internship?.recruiter;
    const recruiterFromApplication = application.recruiterId;

    const recruiterName =
      recruiterFromInternship?.name || recruiterFromApplication?.name || "Unknown Recruiter";
    const recruiterEmail =
      recruiterFromInternship?.email || recruiterFromApplication?.email || "-";

    return {
      applicationId: application._id.toString(),
      appliedAt: application.createdAt,
      studentName: application.studentId?.name || "Unknown Student",
      studentEmail: application.studentId?.email || "-",
      recruiterName,
      recruiterEmail,
      internshipRole: internship?.role || application.internshipTitle || "-",
      companyName: internship?.company || application.companyName || "-",
      companyId: internship?.companyId || "-",
      status: normalizedStatus,
      offerDetails: application.offerDetails || {},
    };
  });
};

exports.getAnalytics = async (req, res) => {
  const loggedInByRole = await User.aggregate([
    { $match: { isLoggedIn: true } },
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const roleMap = { admin: 0, recruiter: 0, student: 0 };
  loggedInByRole.forEach((item) => {
    roleMap[item._id] = item.count;
  });

  const appliedInternships = await AppliedInternship.countDocuments();
  const totalInternships = await Internship.countDocuments();

  const placementAgg = await AppliedInternship.aggregate([
    { $match: { status: { $in: ["hired", "offer_received"] } } },
    { $group: { _id: "$studentId" } },
    { $count: "placedStudents" },
  ]);

  const placedStudents = placementAgg[0]?.placedStudents || 0;

  res.json({
    currentUsers: roleMap.admin + roleMap.recruiter + roleMap.student,
    loggedInUsersByRole: roleMap,
    appliedInternships,
    totalInternships,
    placedStudents,
  });
};

exports.getRecruiters = async (req, res) => {
  const recruiters = await Recruiter.find({ isVerified: true })
    .populate("userId", "name email")
    .sort({ verifiedAt: -1 });

  const data = recruiters.flatMap((rec) => {
    const companies = Array.isArray(rec.verifiedCompanies) && rec.verifiedCompanies.length > 0
      ? rec.verifiedCompanies
      : [{
          companyName: rec.companyName,
          companyId: rec.companyId,
          industry: rec.industry,
          location: rec.location,
          website: rec.website,
          description: rec.description,
          verifiedAt: rec.verifiedAt,
        }];

    return companies
      .filter((company) => company.companyId && company.companyName)
      .map((company) => ({
        id: `${rec._id}-${company.companyId}`,
        recruiterId: rec._id,
        recruiterName: rec.userId?.name || "Unknown",
        recruiterEmail: rec.userId?.email || "-",
        companyName: company.companyName,
        companyId: company.companyId,
        industry: company.industry,
        location: company.location,
        verifiedAt: company.verifiedAt || rec.verifiedAt,
      }));
  }).sort((a, b) => new Date(b.verifiedAt || 0) - new Date(a.verifiedAt || 0));

  res.json(data);
};

exports.getCompanies = async (req, res) => {
  const recruiters = await Recruiter.find({ isVerified: true })
    .select("companyName companyId industry location website verifiedCompanies")
    .sort({ companyName: 1 });

  const uniqueMap = new Map();

  recruiters.forEach((rec) => {
    const companies = Array.isArray(rec.verifiedCompanies) && rec.verifiedCompanies.length > 0
      ? rec.verifiedCompanies
      : [{
          companyName: rec.companyName,
          companyId: rec.companyId,
          industry: rec.industry,
          location: rec.location,
          website: rec.website,
        }];

    companies.forEach((comp) => {
      if (comp.companyId && !uniqueMap.has(comp.companyId)) {
        uniqueMap.set(comp.companyId, {
          companyName: comp.companyName,
          companyId: comp.companyId,
          industry: comp.industry,
          location: comp.location,
          website: comp.website,
        });
      }
    });
  });

  res.json(Array.from(uniqueMap.values()));
};

exports.downloadReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    if (reportId === "1" || reportId === "internship-applications") {
      const rows = await getApplicationRows();
      const doc = startPdfResponse(res, "internship-applications-report.pdf");

      doc.fontSize(18).text("Internship Applications Report", { align: "left" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#555").text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown(0.6);
      doc.fillColor("#000");

      doc.fontSize(12).text("Summary", { underline: true });
      doc.moveDown(0.2);
      doc.fontSize(10).text(`Total Applications: ${rows.length}`);

      const statusCounts = rows.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {});
      doc.text(`Pending: ${statusCounts.pending || 0}`);
      doc.text(`Shortlisted: ${statusCounts.shortlisted || 0}`);
      doc.text(`Interviewing: ${statusCounts.interviewing || 0}`);
      doc.text(`Offer Extended: ${statusCounts.offer_extended || 0}`);
      doc.text(`Hired: ${statusCounts.hired || 0}`);
      doc.text(`Declined By Student: ${statusCounts.declined_by_student || 0}`);
      doc.text(`Rejected: ${statusCounts.rejected || 0}`);

      doc.moveDown(0.8);
      doc.fontSize(12).text("Application Details", { underline: true });
      doc.moveDown(0.4);

      if (rows.length === 0) {
        doc.fontSize(10).text("No applications found.");
      } else {
        rows.forEach((row, index) => {
          ensureSpace(doc, 90);
          doc.fontSize(10).text(`${index + 1}. ${row.studentName} (${row.studentEmail})`);
          doc.text(`   Internship: ${row.internshipRole} | Company: ${row.companyName} (${row.companyId})`);
          doc.text(`   Recruiter: ${row.recruiterName} (${row.recruiterEmail})`);
          doc.text(`   Status: ${row.status} | Applied: ${new Date(row.appliedAt).toLocaleDateString()}`);
          doc.moveDown(0.35);
        });
      }

      doc.end();
      return;
    }

    if (reportId === "2" || reportId === "placement-summary") {
      const rows = await getApplicationRows();
      const doc = startPdfResponse(res, "placement-summary-report.pdf");

      const offerExtended = rows.filter((row) => row.status === "offer_extended").length;
      const hired = rows.filter((row) => row.status === "hired").length;
      const declined = rows.filter((row) => row.status === "declined_by_student").length;
      const rejected = rows.filter((row) => row.status === "rejected").length;
      const pendingPipeline = rows.filter((row) => ["pending", "reviewed", "shortlisted", "interviewing"].includes(row.status)).length;
      const offerAcceptanceRate = offerExtended + hired + declined > 0
        ? Math.round((hired / (offerExtended + hired + declined)) * 100)
        : 0;

      const companyPlacementMap = new Map();
      rows.forEach((row) => {
        if (!companyPlacementMap.has(row.companyName)) {
          companyPlacementMap.set(row.companyName, { total: 0, hired: 0 });
        }
        const agg = companyPlacementMap.get(row.companyName);
        agg.total += 1;
        if (row.status === "hired") {
          agg.hired += 1;
        }
      });

      const companyStats = Array.from(companyPlacementMap.entries())
        .map(([company, stats]) => ({ company, ...stats }))
        .sort((a, b) => b.hired - a.hired || b.total - a.total);

      doc.fontSize(18).text("Placement Summary Report", { align: "left" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#555").text(`Generated: ${new Date().toLocaleString()}`);
      doc.moveDown(0.6);
      doc.fillColor("#000");

      doc.fontSize(12).text("Pipeline Summary", { underline: true });
      doc.moveDown(0.25);
      doc.fontSize(10).text(`Total Applications: ${rows.length}`);
      doc.text(`In Review Pipeline: ${pendingPipeline}`);
      doc.text(`Offers Extended: ${offerExtended}`);
      doc.text(`Hired: ${hired}`);
      doc.text(`Declined By Student: ${declined}`);
      doc.text(`Rejected: ${rejected}`);
      doc.text(`Offer Acceptance Rate: ${offerAcceptanceRate}%`);

      doc.moveDown(0.8);
      doc.fontSize(12).text("Company-wise Placement Performance", { underline: true });
      doc.moveDown(0.3);

      if (companyStats.length === 0) {
        doc.fontSize(10).text("No placement data available.");
      } else {
        companyStats.forEach((item, index) => {
          ensureSpace(doc, 30);
          doc.fontSize(10).text(
            `${index + 1}. ${item.company}: Hired ${item.hired} / Total Applications ${item.total}`
          );
        });
      }

      doc.moveDown(0.8);
      doc.fontSize(12).text("Hired Candidates", { underline: true });
      doc.moveDown(0.3);

      const hiredRows = rows.filter((row) => row.status === "hired");
      if (hiredRows.length === 0) {
        doc.fontSize(10).text("No hired candidates yet.");
      } else {
        hiredRows.forEach((row, index) => {
          ensureSpace(doc, 50);
          doc.fontSize(10).text(`${index + 1}. ${row.studentName} (${row.studentEmail})`);
          doc.text(`   Company: ${row.companyName} | Role: ${row.internshipRole}`);
          doc.text(`   Recruiter: ${row.recruiterName}`);
          doc.moveDown(0.25);
        });
      }

      doc.end();
      return;
    }

    res.status(404).json({ message: "Unknown report type" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
