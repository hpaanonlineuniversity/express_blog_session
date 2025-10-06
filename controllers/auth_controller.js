const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set user info in session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logout a user
exports.logout = (req, res) => {
  const username = req.session.username;
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: `User ${username} logged out successfully` });
  });
};

// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
  
// Middleware to get current user info
exports.getCurrentUser = (req, res) => {
  if (req.session.userId) {
    return res.status(200).json({ userId: req.session.userId, username: req.session.username });
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Middleware to check if the user is admin
exports.isAdmin = (req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        if (user && user.isAdmin) {
          return next();
        }
        res.status(403).json({ message: 'Forbidden' });
      })
      .catch(err => {
        console.error('Error checking admin status:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check if the user is the owner of a resource
exports.isOwner = (req, res, next) => {
  const resourceOwnerId = req.params.userId; // Assuming the resource owner ID is passed as a URL parameter

  if (req.session.userId && req.session.userId.toString() === resourceOwnerId) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
};  

// Middleware to check if the user is either admin or the owner of a resource
exports.isAdminOrOwner = (req, res, next) => {
  const resourceOwnerId = req.params.userId; // Assuming the resource owner ID is passed as a URL parameter

  if (req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        if (user && (user.isAdmin || user._id.toString() === resourceOwnerId)) {
          return next();
        }
        res.status(403).json({ message: 'Forbidden' });
      })
      .catch(err => {
        console.error('Error checking admin or owner status:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check if the user is not authenticated
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.status(400).json({ message: 'Already authenticated' });
};

// Middleware to check if the user is a guest (not logged in)
exports.isGuest = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.status(400).json({ message: 'Already logged in' });
};  

// Middleware to refresh session expiration
exports.refreshSession = (req, res, next) => {
  if (req.session) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
};



