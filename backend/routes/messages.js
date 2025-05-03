const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/conversation', auth, messageController.createConversation);
router.get('/conversations', auth, messageController.getConversations);
router.post('/send', auth, messageController.sendMessage);

module.exports = router;