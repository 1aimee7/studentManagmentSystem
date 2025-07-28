// Load environment variables from the .env file at the very beginning.
require('dotenv').config();

// --- Import Core Packages ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Route Files ---
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---

// --- CORS Configuration for Production ---
// This is the list of URLs that are allowed to make requests to our API.
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://student-managment-system-virid.vercel.app/' // <<-- IMPORTANT: REPLACE THIS WITH YOUR REAL VERCEL URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // The 'origin' is the URL of the website making the request.
    // We check if the incoming origin is in our `allowedOrigins` list.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // If it is, allow the request.
      callback(null, true);
    } else {
      // If it's not, block the request with a CORS error.
      callback(new Error('This origin is not allowed by CORS'));
    }
  }
};

// Use the new, flexible CORS options for all incoming requests.
app.use(cors(corsOptions));
// --- END OF CORS CONFIGURATION ---


// Enable Express to parse incoming requests that have a JSON body.
app.use(express.json());


// --- API Routes ---
// Mount the route handlers on their specific base paths.
app.use('/api/auth', authRoutes);         // Handles all routes starting with /api/auth
app.use('/api/students', studentRoutes);  // Handles all routes starting with /api/students
app.use('/api/users', userRoutes);        // Handles all routes starting with /api/users


// --- API Health Check Route ---
// A simple endpoint to verify that the API server is online.
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Student Management System API!' });
});


// --- Database Connection and Server Startup ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // The server will only start listening for requests after the database is connected.
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    // If the database connection fails, the entire application will exit.
    process.exit(1);
  });