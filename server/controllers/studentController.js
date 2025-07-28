const User = require('../models/User');

/**
 * @desc    Get all students with filtering and pagination
 * @route   GET /api/students
 * @access  Private/Admin
 */
exports.getAllStudents = async (req, res) => {
  try {
    // Parse pagination parameters from the query string, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statusFilter = req.query.statusFilter;

    // Base query to only find users with the 'student' role
    let query = { role: 'student' };

    // --- Simplified Status Filtering Logic ---
    // In a production app, you would add a dedicated 'status' field to the User model.
    if (statusFilter && statusFilter !== 'All') {
        if (statusFilter === 'Graduated') {
            // This is a business rule: we assume students enrolled 2+ years ago are graduated.
            query.enrollmentYear = { $lt: new Date().getFullYear() - 1 };
        } else if (statusFilter === 'Active') {
            query.enrollmentYear = { $gte: new Date().getFullYear() - 1 };
        }
        // Note: 'Dropped' status is not supported by this logic and would need a 'status' field.
    }
    
    // Get the total count of documents that match the filter for pagination
    const total = await User.countDocuments(query);

    // Find the actual student documents, applying sorting, pagination, and field selection
    const students = await User.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(limit) // Limit the number of documents per page
      .select('-password'); // Exclude the password from the result

    // Map the Mongoose documents to the `StudentRecord` format the frontend expects
    const studentRecords = students.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course || 'N/A',
        enrollmentYear: user.enrollmentYear || 0,
        // Re-apply the same status logic to ensure consistency in the response
        status: (user.enrollmentYear && user.enrollmentYear < new Date().getFullYear() - 1) ? 'Graduated' : 'Active',
    }));

    // Send the final response object, which the frontend is expecting
    res.status(200).json({ students: studentRecords, total });

  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching students', error: error.message });
  }
};

/**
 * @desc    Add a new student
 * @route   POST /api/students
 * @access  Private/Admin
 */
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, course, enrollmentYear } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const newStudent = await User.create({
      name,
      email,
      password, // The password will be auto-hashed by the pre-save hook in the User model
      course,
      enrollmentYear,
      role: 'student',
    });

    res.status(201).json({
      id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      course: newStudent.course,
      enrollmentYear: newStudent.enrollmentYear,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while adding student', error: error.message });
  }
};

/**
 * @desc    Update a student's record
 * @route   PUT /api/students/:id
 * @access  Private/Admin
 */
exports.updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (student && student.role === 'student') {
            student.name = req.body.name || student.name;
            student.email = req.body.email || student.email;
            student.course = req.body.course || student.course;
            student.enrollmentYear = req.body.enrollmentYear || student.enrollmentYear;

            const updatedStudent = await student.save();
            res.status(200).json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating student', error: error.message });
    }
};

/**
 * @desc    Delete a student
 * @route   DELETE /api/students/:id
 * @access  Private/Admin
 */
exports.deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (student && student.role === 'student') {
            await student.deleteOne();
            res.status(200).json({ message: 'Student removed successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting student', error: error.message });
    }
};