const User = require('../models/User');

/**
 * @desc    Get the profile of the currently logged-in user
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    // The `protect` middleware has already validated the token and attached the user
    // to the request object (`req.user`). We just need to find them again to be safe.
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user profile back as a JSON response.
    res.status(200).json(user);
  } catch (error) {
    console.error('GET MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * @desc    Update the profile of the currently logged-in user
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateMyProfile = async (req, res) => {
  try {
    // Find the user by the ID from the token
    const user = await User.findById(req.user.id);

    if (user) {
      // Update the user's fields with data from the request body.
      // If a field is not provided in the body, it keeps its old value.
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // Only students can update these fields.
      if (user.role === 'student') {
        user.course = req.body.course || user.course;
        user.enrollmentYear = req.body.enrollmentYear || user.enrollmentYear;
      }
      
      // Save the updated user document to the database.
      const updatedUser = await user.save();

      // Send back the newly updated user profile.
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
    console.error('UPDATE MY PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};