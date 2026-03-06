const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/studentController");
const { recommendInternships } = require("../controllers/studentController");
const { applyInternship } = require("../controllers/studentController");
const { getMyOffers } = require("../controllers/studentController");
const { respondToOffer } = require("../controllers/studentController");

router.get("/:id/dashboard", protect, getDashboard);
router.post("/recommend", protect, recommendInternships);
router.post("/apply", protect, applyInternship);
router.get("/offers", protect, getMyOffers);
router.patch("/offers/:offerId/respond", protect, respondToOffer);
module.exports = router;