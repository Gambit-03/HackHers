const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const recruiterController = require("../controllers/recruiterController");

router.post("/verify", protect, recruiterController.verifyRecruiter);
router.post("/post", protect, recruiterController.postInternship);
router.get("/applications", protect, recruiterController.getApplications);
router.put("/select/:internshipId/:studentId", protect, recruiterController.selectStudent);

module.exports = router;