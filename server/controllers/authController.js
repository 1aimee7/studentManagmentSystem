const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Creates a JWT for a given user.
 * @param {object} user - The Mongoose user object.
 * @returns {string} The generated JSON Web Token.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Payload: data to store in the token
    process.env.JWT_SECRET,            // Secret key from .env file
    { expiresIn: '1d' }                // Token expiration time
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    // 1. Destructure user data from the request body
    const { name, email, password } = req.body;

    // 2. Validate that all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // 3. Check if a user with the given email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // 4. Create a new user instance. The password will be automatically hashed
    //    by the pre-save hook defined in the User model.
    const newUser = await User.create({ name, email, password });

    // 5. Generate a token for the new user so they can be logged in immediately
    const token = generateToken(newUser);

    // 6. Send a success response with the token and user data (excluding the password)
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    // This is our crucial debugging log. It will print the full error to the backend console.
    console.error('REGISTRATION ERROR:', error);
    
    // Send a generic error message to the frontend for security.
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};


/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    // 1. Get credentials from the request body
    const { email, password } = req.body;

    // 2. Validate that email and password were provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // 3. Find the user by their email. We must use `.select('+password')` because
    //    by default, the password field is hidden in our User model.
    const user = await User.findOne({ email }).select('+password');

    // 4. Check if a user was found AND if the provided password is correct.
    //    The `comparePassword` method is a custom method we defined in the User model
    //    that uses bcrypt to securely compare the hashes.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // 5. If credentials are correct, generate a JWT
    const token = generateToken(user);

    // 6. Send the token and user data back to the client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};