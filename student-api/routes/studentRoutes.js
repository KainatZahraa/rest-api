const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  searchStudents,
  getStudentById,
  updateStudent,
  partialUpdateStudent,
  deleteStudent,
  deactivateStudent,
} = require('../controllers/studentController');


router.get('/search', searchStudents);
router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.patch('/:id/deactivate', deactivateStudent);
router.patch('/:id', partialUpdateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;