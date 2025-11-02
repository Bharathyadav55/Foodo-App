require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import Passport config
require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

// Initialize Express app
const app = express();

// ====== MIDDLEWARE ======

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'foodoo-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS only)
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// ====== ROUTES ======

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: "Foodoo Backend API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ====== DATABASE & SERVER ======

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodoo';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
