const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, userController.getAllUsers);
router.get('/:id?', auth, userController.getUserProfile);
router.patch('/profile', auth, upload.single('avatar'), userController.updateUserProfile);

module.exports = router;
