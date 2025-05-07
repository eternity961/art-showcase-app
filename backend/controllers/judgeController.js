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
    const categories = ['literal', 'visual', 'vocal'];
    const results = [];

    for (const category of categories) {
      // Fetch all posts in the category
      const posts = await Post.find({ category }).populate('user', 'username profile.avatar');

      // Calculate max likes in this category
      const maxLikes = Math.max(...posts.map(p => p.likes?.length || 0), 1); // prevent divide by 0

      const scoredPosts = [];

      for (const post of posts) {
        const likes = post.likes?.length || 0;

        // Get average judge score
        const evaluations = await Evaluation.find({ post: post._id });
        const avgJudgeScore = evaluations.length
          ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
          : 0;

        const userScoreOutOf40 = (likes / maxLikes) * 40;
        const judgeScoreOutOf60 = (avgJudgeScore / 10) * 60;

        const finalScore = userScoreOutOf40 + judgeScoreOutOf60;

        scoredPosts.push({
          post,
          userScore: userScoreOutOf40,
          judgeScore: judgeScoreOutOf60,
          finalScore,
        });
      }

      // Sort and select top 3
      const top10 = scoredPosts
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 10);

      results.push({ category, top10 });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


