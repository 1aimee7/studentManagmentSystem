const express = require('express');
const router = express.Router();

// --- THIS IS THE FIX ---
// Import the entire controller object. This is a safer way to import
// and avoids errors from typos in destructuring assignments.
const userController = require('../controllers/userController');

// Import the security middleware that checks if a user is logged in.
const { protect } = require('../middleware/authMiddleware');

// Define the routes for the '/me' endpoint (full path: /api/users/me).
// A request must pass the `protect` middleware before it can reach the controller functions.
router.route('/me')
  .get(protect, userController.getMyProfile)    // For GET requests, use the getMyProfile function
  .put(protect, userController.updateMyProfile);   // For PUT requests, use the updateMyProfile function

// Export the router so it can be used in server.js
module.exports = router;