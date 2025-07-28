const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When a POST request is made to /register, run the register function
router.post('/register', authController.register);

// When a POST request is made to /login, run the login function
router.post('/login', authController.login);

module.exports = router;