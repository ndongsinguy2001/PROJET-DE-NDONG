// Routes Classes

const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass
} = require('../controllers/classController');
const { protect } = require('../middleware/auth');

// Toutes les routes sont protégées
router.use(protect);

// Routes principales
router.route('/')
  .get(getAllClasses)
  .post(createClass);

router.route('/:id')
  .get(getClassById)
  .put(updateClass)
  .delete(deleteClass);

// Routes pour gérer les élèves dans une classe
router.route('/:id/students')
  .post(addStudentToClass);

router.route('/:id/students/:studentId')
  .delete(removeStudentFromClass);

module.exports = router;