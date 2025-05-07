const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Endpoint for chatting with the bot
router.post('/chat', auth, chatWithBot);

module.exports = router;
