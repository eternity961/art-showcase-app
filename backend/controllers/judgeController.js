const Post = require('../models/Post');
const Evaluation = require('../models/Evaluation');
const Notification = require('../models/Notification');

exports.getTopPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const posts = await Post.find(query)
      .sort({ likes: -1 })
      .limit(10)
      .populate('user', 'username profile.avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top posts', error: err.message });
  }
};

exports.evaluatePost = async (req, res) => {
  try {
    const { postId, score, feedback } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const evaluation = new Evaluation({
      post: postId,
      judge: req.user.id,
      score,
      feedback,
    });
    await evaluation.save();
    const notification = new Notification({
      user: post.user,
      type: 'judge',
      content: `Your post was evaluated by a judge`,
      relatedId: evaluation._id,
    });
    await notification.save();
    req.io.to(post.user.toString()).emit('notification', notification);
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating post', error: err.message });
  }
};

exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ judge: req.user.id })
      .populate('post', 'title category')
      .populate('judge', 'username');
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching evaluations', error: err.message });
  }
};