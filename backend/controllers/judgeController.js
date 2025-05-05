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
      relatedId: post._id,
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

exports.getUserRankings = async (req, res) => {
  try {
    const rankings = await Evaluation.aggregate([
      {
        $group: {
          _id: '$user',
          averageScore: { $avg: '$score' },
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);
    
    res.json(rankings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rankings', error: err.message });
  }
};

exports.getTopRanked = async (req, res) => {
  try {
    // Find the evaluation with the highest score
    const topEvals = await Evaluation.find()
    .sort({ score: -1 })
    .limit(10)
    .populate({
      path: 'post',
      populate: {
        path: 'user',
        select: 'username profile.avatar',
      },
    });

  // Filter out evaluations that have no valid post or user
  const filtered = topEvals.filter(e => e.post && e.post.user);

  const results = filtered.map(e => ({
    post: e.post,
    score: e.score,
  }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


