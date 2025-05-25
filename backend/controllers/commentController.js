const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      post: req.params.postId,
      user: req.user.id,
      content,
    });
    await comment.save();

    // Notify post owner if commenter is not the owner
    console.log(post.user.toString() === req.user.id);
    if (post.user.toString() !== req.user.id) {
      const sender = await User.findById(req.user.id).select('username');

     try{
      await createNotification({
          recipientId: post.user,
          senderId: req.user.id,
          type: 'comment',
          message: `${sender.username} commented on your post "${post.title}".`,
          postId: post._id,
        });
      }catch (error) {
        console.error('Error creating notification:', error);
      }
     }


    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Error creating comment', error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username profile.avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
