const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    // The `protect` middleware has already found the user and attached it to `req.user`.
    // We just need to send it back.
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Update the fields from the request body
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // Student-specific fields
      if (user.role === 'student') {
        user.course = req.body.course || user.course;
        user.enrollmentYear = req.body.enrollmentYear || user.enrollmentYear;
      }
      
      const updatedUser = await user.save();

      // Send back the updated user profile
      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        course: updatedUser.course,
        enrollmentYear: updatedUser.enrollmentYear,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};