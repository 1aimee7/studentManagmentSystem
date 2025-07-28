const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Import only the 'protect' middleware

// Apply the 'protect' middleware to both routes in this file.
// This ensures that a user MUST be logged in to access their profile.
router.route('/me')
  .get(protect, getMyProfile)     // GET /api/users/me
  .put(protect, updateMyProfile);    // PUT /api/users/me

module.exports = router;