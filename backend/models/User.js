const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'judge', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  profile: {
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
resetPasswordExpires: Date,
otp: String,
otpExpires: Date,
isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
