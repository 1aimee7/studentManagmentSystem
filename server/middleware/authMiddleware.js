const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require a user to be logged in
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token is valid using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database using the ID from the token
      // We attach the full user object (minus password) to the request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 4. If all is good, proceed to the next function (e.g., the controller)
      next();
    } catch (error) {
      console.error('TOKEN VERIFICATION ERROR:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the logged-in user is an admin
exports.isAdmin = (req, res, next) => {
  // This runs AFTER `protect`, so `req.user` is available
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // 403 Forbidden is the correct status code for a role mismatch
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};