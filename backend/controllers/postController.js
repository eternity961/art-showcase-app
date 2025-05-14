const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const file = req.file ? req.file.path.replace(/\\/g, '/') : null; // 🔁 replace \ with /
    const post = new Post({ user: req.user.id, title, content, category, file });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user: userId })
      .populate('user', 'username profile.avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user posts', error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username profile.avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username profile.avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
      if (post.user.toString() !== req.user.id) {
        const notification = new Notification({
          user: post.user,
          type: 'like',
          content: `${req.user.username} liked your post`,
          relatedId: post._id,
        });
        await notification.save();
        req.io.to(post.user.toString()).emit('notification', notification);
      }
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};
