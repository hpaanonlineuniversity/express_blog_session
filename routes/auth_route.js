const authController = require('../controllers/auth_controller');

const express = require('express');
const router = express.Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);


// Get current user info
router.get('/current', authController.getCurrentUser); 

// Export the router

module.exports = router;