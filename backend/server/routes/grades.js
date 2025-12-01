// server/routes/grades.js
const express = require('express');
const router = express.Router();
const {
  updateGrades,
  getStudentGrades,
  getStudentsWithGrades
} = require('../controllers/gradeController');

router.put('/:id/grades', updateGrades);
router.get('/:id/grades', getStudentGrades);
router.get('/with-grades', getStudentsWithGrades); // /api/students/with-grades

module.exports = router;