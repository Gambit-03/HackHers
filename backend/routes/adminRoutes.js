const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/analytics", adminController.getAnalytics);
router.get("/recruiters", adminController.getRecruiters);
router.get("/companies", adminController.getCompanies);
router.get("/reports/:id", adminController.downloadReport);

module.exports = router;