const express = require('express');
const router = express.Router();

// --- THIS IS THE FIX ---
// Import the entire controller object first.
const userController = require('../controllers/userController');

// Import the security middleware.
const { protect } = require('../middleware/authMiddleware');

// Define the routes for the '/me' endpoint.
// A request must pass the `protect` middleware before it can reach the controller.
// We correctly reference the functions as properties of the imported controller object.
router.route('/me')
  .get(protect, userController.getMyProfile)
  .put(protect, userController.updateMyProfile);

module.exports = router;