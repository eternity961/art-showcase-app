const Post = require('../models/Post');
const Notification = require('../models/Notification');

const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const file = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const post = new Post({
      user: req.user.id,
      title,
      content,
      category,
      file,
    });

    await post.save();

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const sender = await User.findById(req.user.id).select('username');
    for (const admin of admins) {
      await createNotification({
        recipientId: admin._id,
        senderId: req.user.id,
        type: 'post',
        message: `${sender.username} created a new post.`,
        postId: post._id,
      });
    }

    // Notify the respective judge based on category
    const judgeRole = category === 'Literal Art' ? 'literal_judge'
                    : category === 'Visual Art' ? 'visual_judge'
                    : category === 'Vocal' ? 'vocal_judge'
                    : null;

    if (judgeRole) {
      const judge = await User.findOne({ role: judgeRole });
    const sender = await User.findById(req.user.id).select('username');
      if (judge) {
        await createNotification({
          recipientId: judge._id,
          senderId: req.user.id,
          type: 'post',
          message: `${sender.username} created a ${category} post.`,
          postId: post._id,
        });
      }
    }

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
        const sender = await User.findById(req.user.id).select('username');
        await createNotification({
          recipientId: post.user,
          senderId: req.user.id,
          type: 'like',
          message: `${sender.username} liked your post.`,
          postId: post._id,
        });
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

exports.getReportedPosts = async (req, res) => {
  try {
    const reportedPosts = await Post.find({ reported: true })
      .populate('user', 'username profile.avatar')
      .sort({ createdAt: -1 });

    res.json(reportedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reported posts', error: err.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    if (req.file) {
      post.file = req.file.path.replace(/\\/g, '/');
    }

    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post', error: err.message });
  }
};
exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.reported = true;
    await post.save();
    res.json({ message: 'Post reported successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error reporting post', error: err.message });
  }
};
