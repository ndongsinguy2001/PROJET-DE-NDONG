// Routes Grades

const express = require('express');
const router = express.Router();
const {
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByClass,
  createGrade,
  updateGrade,
  deleteGrade,
  calculateStudentAverage
} = require('../controllers/gradeController');
const { protect } = require('../middleware/auth');

// Toutes les routes sont protégées
router.use(protect);

// Routes principales
router.route('/')
  .get(getAllGrades)
  .post(createGrade);

// Routes spécifiques
router.route('/student/:studentId')
  .get(getGradesByStudent);

router.route('/student/:studentId/average')
  .get(calculateStudentAverage);

router.route('/class/:className')
  .get(getGradesByClass);

router.route('/:id')
  .get(getGradeById)
  .put(updateGrade)
  .delete(deleteGrade);

module.exports = router;