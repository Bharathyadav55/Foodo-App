const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Google OAuth fields
  googleId: { type: String, sparse: true },
  
  // Common fields
  name: String,
  email: { type: String, unique: true, sparse: true },
  photo: String,
  
  // Manual signup fields
  password: String,  // ✅ Hashed password for email/password auth
  firstName: String,
  lastName: String,
  dob: {
    day: String,
    month: String,
    year: String
  },
  gender: String,
  
  // Additional fields
  address: String,
  phone: String,
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
