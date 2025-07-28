const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware will protect routes
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an Authorization header, and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the database using the ID from the token
      // We attach the user to the request object so our controllers can use it
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user is not found
      if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
      }

      // 5. Continue to the next step (either another middleware or the controller)
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This middleware will check for a specific role
exports.isAdmin = (req, res, next) => {
  // We assume the 'protect' middleware has already run and attached `req.user`
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};