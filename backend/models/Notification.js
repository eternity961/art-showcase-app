const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'message', 'judge'], required: true },
  content: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Post, Comment, or Conversation ID
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
