const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
