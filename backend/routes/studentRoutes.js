const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/studentController");
const { recommendInternships } = require("../controllers/studentController");

router.get("/:id/dashboard", getDashboard);
router.post("/recommend", protect, recommendInternships);
module.exports = router;