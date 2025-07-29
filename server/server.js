require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- THIS IS THE CRITICAL UPDATE for DEPLOYMENT ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://student-managment-system-virid.vercel.app' // <<-- I GOT THIS FROM YOUR SCREENSHOT
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or from our allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  // This tells the browser which HTTP methods are allowed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // This tells the browser which custom headers are allowed in requests
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

// Use the new, more flexible CORS options
app.use(cors(corsOptions));
// --- END OF CORS UPDATE ---

app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Student Management System API!' });
});

// ... (Database connection and server startup remain the same)
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