const express = require('express');
const router = express.Router();

// --- THE FIX ---
// Import all the necessary functions from the controller using destructuring.
// By replacing the whole file, we ensure there are no typos.
const {
  getStudentStats,
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Apply security middleware to all routes in this file.
router.use(protect, isAdmin);


// --- ROUTE DEFINITIONS ---

// IMPORTANT: Specific routes like '/stats' must come before generic routes with parameters like '/:id'.
router.get('/stats', getStudentStats);


// Routes for the general student collection
router.route('/')
  .get(getAllStudents)
  .post(addStudent);


// Routes for a single student, identified by their ID
router.route('/:id')
  .put(updateStudent) // This is the line that was causing the crash
  .delete(deleteStudent);


module.exports = router;