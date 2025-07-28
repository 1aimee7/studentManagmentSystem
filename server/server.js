// Load environment variables from the .env file at the very beginning.
require('dotenv').config();

// --- Import Core Packages ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Route Files ---
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- 1. IMPORT the new user routes

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


// --- API Routes ---
// Mount the imported route handlers on specific URL paths.
app.use('/api/auth', authRoutes);         // Handles /api/auth/login, /api/auth/register
app.use('/api/students', studentRoutes);  // Handles /api/students, /api/students/:id
app.use('/api/users', userRoutes);        // <-- 2. USE the new user routes for /api/users/me


// --- Default Route for API status ---
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Student Management System API!' });
});


// --- Database Connection and Server Startup ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });