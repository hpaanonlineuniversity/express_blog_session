//middleare to check if user is logged in
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

//  middleware to log session info for debugging
exports.logSession = (req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
};

// middleware to destroy session (for testing purposes)
exports.destroySession = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not destroy session', err });
    }
    res.clearCookie('connect.sid'); // Assuming default cookie name
    res.status(200).json({ message: 'Session destroyed' });
  });
};


// middleware to refresh session expiration
exports.refreshSession = (req, res, next) => {
  if (req.session) {
    req.session.touch();
  }
  next();
};

// middleware to extend session expiration on each request
exports.extendSession = (req, res, next) => {
  if (req.session) {
    req.session.cookie.maxAge = 1000 * 60 * 10; // Extend by 10 minutes
  }
  next();
};


// middleware to check if session is about to expire (within 2 minutes)
exports.checkSessionExpiry = (req, res, next) => {
  if (req.session) {
    const now = Date.now();
    const maxAge = req.session.cookie.maxAge;
    const expiryTime = req.session.cookie.expires ? new Date(req.session.cookie.expires).getTime() : now + maxAge;

    if (expiryTime - now < 2 * 60 * 1000) { // less than 2 minutes
      console.log('Session is about to expire');
      // Optionally, you can refresh the session here
      req.session.touch();
    }
  }
  next();
};

// middleware to log user activity
exports.logUserActivity = (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log(`User ${req.session.userId} made a request to ${req.originalUrl} at ${new Date().toISOString()}`);
  }
  next();
};

// middleware to limit session duration (e.g., max 1 hour)
exports.limitSessionDuration = (req, res, next) => {
  if (req.session) {
    const now = Date.now();
    const createdAt = req.session.createdAt || now;
    req.session.createdAt = createdAt;

    if (now - createdAt > 60 * 60 * 1000) { // more than 1 hour
      return req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: 'Could not destroy session', err });
        }
        res.clearCookie('connect.sid'); // Assuming default cookie name
        return res.status(440).json({ message: 'Session expired due to inactivity' }); // 440 Login Time-out
      });
    }
  }
  next();
};

// Middleware to handle session errors
exports.handleSessionError = (err, req, res, next) => {
  if (err) {
    console.error('Session error:', err);
    return res.status(500).json({ message: 'Session error', err });
  }
  next();
};

// Middleware to ensure session is saved before response is sent
exports.saveSession = (req, res, next) => {
  if (req.session) {
    req.session.save(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not save session', err });
      }
      next();
    });
  } else {
    next();
  }
};

// Middleware to regenerate session (e.g., after login)
exports.regenerateSession = (req, res, next) => {
  req.session.regenerate(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not regenerate session', err });
    }
    next();
  });
};

// Middleware to set a custom session attribute
exports.setCustomSessionAttribute = (key, value) => {
  return (req, res, next) => {
    if (req.session) {
      req.session[key] = value;
    }
    next();
  };
};

// Middleware to get a custom session attribute
exports.getCustomSessionAttribute = (key) => {
  return (req, res, next) => {
    if (req.session) {
      req.customAttribute = req.session[key];
    }
    next();
  };
};

// Middleware to clear a custom session attribute
exports.clearCustomSessionAttribute = (key) => {
  return (req, res, next) => {
    if (req.session && req.session[key]) {
      delete req.session[key];
    }
    next();
  };
};

// Middleware to refresh session expiration if user is active
exports.refreshIfActive = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.session.touch();
  }
  next();
};

// Middleware to log session creation time
exports.logSessionCreation = (req, res, next) => {
  if (req.session && !req.session.createdAt) {
    req.session.createdAt = Date.now();
    console.log('Session created at:', new Date(req.session.createdAt).toISOString());
  }
  next();
};

// Middleware to check if session is new
exports.isNewSession = (req, res, next) => {
  if (req.session && req.session.isNew) {
    console.log('This is a new session');
  }
  next();
};

// Middleware to set a flash message in session
exports.setFlashMessage = (req, res, next) => {
  if (req.session) {
    req.session.flash = 'This is a flash message';
  }
  next();
};

// Middleware to get and clear flash message from session
exports.getFlashMessage = (req, res, next) => {
  if (req.session && req.session.flash) {
    req.flashMessage = req.session.flash;
    delete req.session.flash;
  }
  next();
};

// Middleware to check if user is admin (assuming isAdmin flag in session)
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Admins only' });
};

// Middleware to log out user and destroy session
exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out', err });
      }
      res.clearCookie('connect.sid'); // Assuming default cookie name
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    res.status(200).json({ message: 'No active session' });
  }
};
