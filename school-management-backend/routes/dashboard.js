const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/stats", getGlobalStats);

module.exports = router;
