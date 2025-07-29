const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// This line applies BOTH middleware to ALL routes in this file.
// A request must pass `protect` first, then `isAdmin`.
router.use(protect, isAdmin);

router.route('/').get(studentController.getAllStudents).post(studentController.addStudent);
router.route('/:id').put(studentController.updateStudent).delete(studentController.deleteStudent);

module.exports = router;