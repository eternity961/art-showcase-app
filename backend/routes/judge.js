const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const auth = require('../middleware/auth');
const isJudge = require('../middleware/isJudge');

router.get('/top-posts', auth, isJudge, judgeController.getTopPosts);
router.post('/evaluate', auth, isJudge, judgeController.evaluatePost);
router.get('/evaluations', auth, isJudge, judgeController.getEvaluations);

module.exports = router;
