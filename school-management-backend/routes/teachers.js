
// routes/teachers.js

const express = require("express");
const router = express.Router();

const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const { protect, authorize } = require("../middleware/auth");

//  Protection + rôle ADMIN
router.use(protect);
router.use(authorize("Admin"));

router.route("/")
  .get(getAllTeachers)
  .post(createTeacher);

router.route("/:id")
  .get(getTeacherById)
  .put(updateTeacher)
  .delete(deleteTeacher);

module.exports = router;
