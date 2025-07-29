const express = require('express');
const router = express.Router();

// --- THIS IS THE FIX ---
// We need to import the entire controller object and then access its properties.
const userController = require('../controllers/userController');
// --- END OF FIX ---

const { protect } = require('../middleware/authMiddleware');

// These routes are for ANY logged-in user, so we only need the 'protect' middleware.
// We use userController.getMyProfile and userController.updateMyProfile.
router.route('/me')
  .get(protect, userController.getMyProfile)
  .put(protect, userController.updateMyProfile);

module.exports = router;