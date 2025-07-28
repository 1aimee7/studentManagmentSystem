const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Do not send the password in query results by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  // --- Student-specific fields ---
  phone: String,
  course: String,
  enrollmentYear: Number,
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Add timestamps (createdAt, updatedAt) to the schema
  timestamps: true 
});

// Mongoose "pre-save" middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with a cost factor of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare entered password with the hashed password in the DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- THIS IS THE CRITICAL LINE ---
// This ensures that when we `require('../models/User')`, we get the actual Mongoose model
// and not some other object.
module.exports = mongoose.model('User', userSchema);