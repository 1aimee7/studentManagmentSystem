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

// --- THIS IS THE CRITICAL UPDATE for DEPLOYMENT ---
// Define a list of allowed origins (URLs that can make requests to this API)
const allowedOrigins = [
  'http://localhost:3000', // Your local frontend for development
  'https://your-frontend-site.vercel.app' // <<-- IMPORTANT: REPLACE THIS WITH YOUR REAL VERCEL URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // The 'origin' is the URL of the site making the request (e.g., your Vercel URL)
    // We check if this origin is in our allowed list.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // If it's in the list (or if there's no origin, like a Postman request), allow it.
      callback(null, true);
    } else {
      // If it's not in the list, reject the request.
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Use the new, more flexible CORS options
app.use(cors(corsOptions));
// --- END OF CORS UPDATE ---


// Enable Express to parse incoming requests with JSON payloads.
app.use(express.json());


// --- API Routes ---
// Mount the imported route handlers on specific URL paths.
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);


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