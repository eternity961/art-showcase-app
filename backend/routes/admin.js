const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/users', auth, isAdmin, adminController.getUsers);
router.post('/ban/:id', auth, isAdmin, adminController.banUser);
router.post('/unban/:id', auth, isAdmin, adminController.unbanUser);
router.post('/assign-judge/:id', auth, isAdmin, adminController.assignJudge);
router.delete('/posts/:id', auth, isAdmin, adminController.deletePost);
router.delete('/comments/:id', auth, isAdmin, adminController.deleteComment);

module.exports = router;