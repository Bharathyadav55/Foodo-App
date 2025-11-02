const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// ========== GOOGLE OAUTH ROUTES ==========

// Trigger Google sign-in
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Callback from Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=OAuthUserNotFound`);
    }
    
    // Generate JWT with user info
    const token = jwt.sign({
      userId: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?token=${token}`);
  }
);

// ========== EMAIL/PASSWORD AUTH ROUTES ==========

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, emailOrPhone, password, dob, gender } = req.body;

    // Validate required fields
    if (!firstName || !emailOrPhone || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailOrPhone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: emailOrPhone,
      password: hashedPassword,
      dob: dob || {},
      gender: gender || 'Female',
      photo: null
    });

    // Generate JWT token
    const token = jwt.sign({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      photo: newUser.photo
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        photo: newUser.photo
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed', details: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user has a password (not Google OAuth user)
    if (!user.password) {
      return res.status(401).json({ error: 'Please login with Google' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({
      userId: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

module.exports = router;
