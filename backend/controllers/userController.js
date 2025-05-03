const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id || req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const avatar = req.file ? req.file.path : null;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.username = username || user.username;
    user.profile.bio = bio || user.profile.bio;
    if (avatar) user.profile.avatar = avatar;
    await user.save();
    res.json({ message: 'Profile updated', user: user.toObject({ getters: true }) });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
