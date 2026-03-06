const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
	if (req.user?.role !== "admin") {
		return res.status(403).json({ message: "Admin access only" });
	}
	next();
};

router.get("/analytics", protect, adminOnly, adminController.getAnalytics);
router.get("/recruiters", protect, adminOnly, adminController.getRecruiters);
router.get("/companies", protect, adminOnly, adminController.getCompanies);
router.get("/reports/internship-applications", protect, adminOnly, (req, res) => {
	req.params.id = "internship-applications";
	return adminController.downloadReport(req, res);
});
router.get("/reports/placement-summary", protect, adminOnly, (req, res) => {
	req.params.id = "placement-summary";
	return adminController.downloadReport(req, res);
});
router.get("/reports/:id", protect, adminOnly, adminController.downloadReport);

module.exports = router;