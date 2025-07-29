const express = require('express');
const router = express.Router();

// --- Import Controller Functions ---
// We import all the functions exported from the userController file.
const {
  getMyProfile,
  updateMyProfile,
  updateUserRole,
} = require('../controllers/userController');

// --- Import Security Middleware ---
// `protect` checks for a valid JWT to see if the user is logged in.
// `isAdmin` checks if the logged-in user has the 'admin' role.
const { protect, isAdmin } = require('../middleware/authMiddleware');


// ==============================
// === ROUTE DEFINITIONS ===
// ==============================

// --- Routes for a user's OWN profile ---
// These routes handle actions for the currently authenticated user.
// The full path is `/api/users/me`.
router.route('/me')
  .get(protect, getMyProfile)     // GET: Fetches the logged-in user's profile. Requires login.
  .put(protect, updateMyProfile);    // PUT: Updates the logged-in user's profile. Requires login.


// --- Route for an ADMIN to manage user roles ---
// This route is for a privileged administrative action.
// The full path is `/api/users/:id/role`.
router.put(
  '/:id/role',      // The ':id' is a URL parameter for the user being changed.
  protect,          // 1. First, check if the person making the request is logged in.
  isAdmin,          // 2. Second, check if that logged-in person is an admin.
  updateUserRole    // 3. If both checks pass, execute the controller function.
);


// Export the configured router to be used in server.js
module.exports = router;