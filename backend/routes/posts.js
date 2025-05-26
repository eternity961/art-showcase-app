const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create a post (user)
router.post('/', auth, upload.single('file'), postController.createPost);

// Get all posts
router.get('/', postController.getPosts);

// Get posts by user
router.get('/user/:userId', auth, postController.getPostsByUser);

// Get reported posts (admin only)
router.get('/reported/all', auth, postController.getReportedPosts);

// Get a single post
router.get('/:id', postController.getPostById);

// Like/unlike a post
router.post('/:id/like', auth, postController.likePost);

// Report a post (user)
router.put('/:id/report', auth, postController.reportPost);

// Edit a post (user)
router.put('/:id', auth, upload.single('file'), postController.updatePost);

// Delete a post (user or admin)
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
