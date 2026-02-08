
const express = require("express");
const router = express.Router();
const {
  getAttendanceByClassAndDate,
  markAttendance,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getAttendanceByClassAndDate);
router.post("/", markAttendance);

module.exports = router;
