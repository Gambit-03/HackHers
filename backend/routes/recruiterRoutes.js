const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");
const recruiterController = require("../controllers/recruiterController");

const uploadDir = path.join(__dirname, "..", "uploads", "offer-letters");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadDir),
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname) || ".pdf";
		cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (file.mimetype === "application/pdf") {
			cb(null, true);
			return;
		}
		cb(new Error("Only PDF offer letters are allowed"));
	},
});

router.post("/verify", protect, recruiterController.verifyRecruiter);
router.get("/companies", protect, recruiterController.getCompanyCatalog);
router.get("/me", protect, recruiterController.getMyRecruiterProfile);
router.post("/post", protect, recruiterController.postInternship);
router.get("/applications", protect, recruiterController.getApplications);
router.patch("/applications/:applicationId/status", protect, recruiterController.updateApplicationStatus);
router.patch(
	"/applications/:applicationId/extend-offer",
	protect,
	upload.single("offerLetter"),
	recruiterController.extendOffer
);
router.put("/select/:internshipId/:studentId", protect, recruiterController.selectStudent);

module.exports = router;