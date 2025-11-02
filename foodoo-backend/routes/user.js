const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = data;
    next();
  });
}

// === Multer for Photo Upload ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) =>
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`)
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// === Get current user ===
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// === Update user profile ===
router.put("/me", auth, upload.single("photo"), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
    };
    
    if (req.file) {
      updates.photo = `/uploads/${req.file.filename}`;
    }
    
    const updated = await User.findByIdAndUpdate(
      req.user.userId, 
      updates, 
      { new: true, runValidators: true }
    ).select("-__v");
    
    if (!updated) return res.status(404).json({ error: "User not found" });
    
    res.json(updated);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
