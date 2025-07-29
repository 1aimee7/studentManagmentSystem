const User = require('../models/User');

/**
 * @desc    Get dashboard statistics (total, active, graduated students)
 * @route   GET /api/students/stats
 * @access  Private/Admin
 */
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', enrollmentYear: { $gte: new Date().getFullYear() - 1 } });
    const graduatedStudents = await User.countDocuments({ role: 'student', enrollmentYear: { $lt: new Date().getFullYear() - 1 } });

    res.status(200).json({ total: totalStudents, active: activeStudents, graduated: graduatedStudents });
  } catch (error) {
    console.error("GET STATS ERROR:", error);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
};

/**
 * @desc    Get all students with filtering and pagination
 * @route   GET /api/students
 * @access  Private/Admin
 */
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statusFilter = req.query.statusFilter;

    let query = { role: 'student' };

    if (statusFilter && statusFilter !== 'All') {
        if (statusFilter === 'Graduated') {
            query.enrollmentYear = { $lt: new Date().getFullYear() - 1 };
        } else if (statusFilter === 'Active') {
            query.enrollmentYear = { $gte: new Date().getFullYear() - 1 };
        }
    }
    
    const total = await User.countDocuments(query);
    const students = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-password');

    const studentRecords = students.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course || 'N/A',
        enrollmentYear: user.enrollmentYear || 0,
        status: (user.enrollmentYear && user.enrollmentYear < new Date().getFullYear() - 1) ? 'Graduated' : 'Active',
    }));

    res.status(200).json({ students: studentRecords, total });
  } catch (error) {
    console.error("GET ALL STUDENTS ERROR:", error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

/**
 * @desc    Add a new student
 * @route   POST /api/students
 * @access  Private/Admin
 */
exports.addStudent = async (req, res) => {
  try {
    const { name, email, course, enrollmentYear } = req.body;
    const password = 'defaultPassword123';

    if (!name || !email || !course || !enrollmentYear) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A student with this email already exists' });
    }

    const newStudent = await User.create({ name, email, password, course, enrollmentYear, role: 'student' });

    // Send back a clean object, not the full Mongoose document
    res.status(201).json({
      id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      course: newStudent.course,
      enrollmentYear: newStudent.enrollmentYear,
    });
  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);
    res.status(500).json({ message: 'Server error while adding student' });
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

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // --- IMPROVEMENT: Check for duplicate email on update ---
        if (req.body.email && req.body.email !== student.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'This email is already taken by another user.' });
            }
        }
        
        // Update fields
        student.name = req.body.name || student.name;
        student.email = req.body.email || student.email;
        student.course = req.body.course || student.course;
        student.enrollmentYear = req.body.enrollmentYear || student.enrollmentYear;

        const updatedStudent = await student.save();

        // Send back a clean, consistent response
        res.status(200).json({
            id: updatedStudent._id,
            name: updatedStudent.name,
            email: updatedStudent.email,
            course: updatedStudent.course,
            enrollmentYear: updatedStudent.enrollmentYear,
        });

    } catch (error) {
        console.error("UPDATE STUDENT ERROR:", error);
        res.status(500).json({ message: 'Server error while updating student' });
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

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.deleteOne();
        res.status(200).json({ message: 'Student removed successfully' });
    } catch (error) {
        console.error("DELETE STUDENT ERROR:", error);
        res.status(500).json({ message: 'Server error while deleting student' });
    }
};