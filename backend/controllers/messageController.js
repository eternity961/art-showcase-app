const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

exports.createConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
    });
    if (!conversation) {
      conversation = new Conversation({ participants: [req.user.id, recipientId] });
      await conversation.save();
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Error creating conversation', error: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'username profile.avatar')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching conversations', error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    const message = { sender: req.user.id, content };
    conversation.messages.push(message);
    conversation.updatedAt = Date.now();
    await conversation.save();
    const recipientId = conversation.participants.find(id => id.toString() !== req.user.id);
    req.io.to(conversationId).emit('message', message);
    const notification = new Notification({
      user: recipientId,
      type: 'message',
      content: `${req.user.username} sent you a message`,
      relatedId: conversationId,
    });
    await notification.save();
    req.io.to(recipientId.toString()).emit('notification', notification);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};
