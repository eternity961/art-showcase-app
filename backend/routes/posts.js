const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('file'), postController.createPost);
router.get('/', postController.getPosts);
router.get('/user/:userId', auth, postController.getPostsByUser);
router.get('/:id', postController.getPostById);
router.post('/:id/like', auth, postController.likePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
