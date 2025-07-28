const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Apply the middleware to all routes in this file.
// First 'protect' runs to check for a valid token.
// Then 'isAdmin' runs to check if the user's role is 'admin'.
// If either fails, the request is rejected and never reaches the controller.
router.use(protect, isAdmin);

// Define the routes
router.route('/')
  .get(getAllStudents)   // GET /api/students
  .post(addStudent);      // POST /api/students

router.route('/:id')
  .put(updateStudent)     // PUT /api/students/some_id
  .delete(deleteStudent); // DELETE /api/students/some_id

module.exports = router;