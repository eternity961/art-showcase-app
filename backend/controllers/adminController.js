const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('username email role isBanned');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = true;
    await user.save();
    res.json({ message: 'User banned' });
  } catch (err) {
    res.status(500).json({ message: 'Error banning user', error: err.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = false;
    await user.save();
    res.json({ message: 'User unbanned' });
  } catch (err) {
    res.status(500).json({ message: 'Error unbanning user', error: err.message });
  }
};

exports.assignJudge = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'judge';
    await user.save();
    res.json({ message: 'User assigned as judge' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning judge', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
