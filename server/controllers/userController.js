const User = require('../models/User');

/**
 * @desc    Get the profile of the currently logged-in user
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('GET MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * @desc    Update the profile of the currently logged-in user
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (user.role === 'student') {
        user.course = req.body.course || user.course;
        user.enrollmentYear = req.body.enrollmentYear || user.enrollmentYear;
      }
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('UPDATE MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};


// --- THIS IS THE MISSING FUNCTION ---
/**
 * @desc    Update a user's role (Admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'student'].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified. Must be 'admin' or 'student'." });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};
// --- END OF MISSING FUNCTION ---