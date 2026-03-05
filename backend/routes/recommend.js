const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { recommendInternships } = require("../controllers/recommendController");

router.post("/", protect, recommendInternships);

module.exports = router;