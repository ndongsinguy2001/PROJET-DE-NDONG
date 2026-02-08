const express = require('express');
const router = express.Router();

const {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudent,
} = require('../controllers/studentController');

// /api/students
router.get('/', getStudents);
router.post('/', createStudent);
router.delete('/:id', deleteStudent);
router.put('/:id', updateStudent);
module.exports = router;
