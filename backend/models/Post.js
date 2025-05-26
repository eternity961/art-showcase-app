const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String }, // Text content
  file: { type: String }, // Path to audio/image file
  category: { type: String, enum: ['literal', 'visual', 'vocal'], required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reported: {
  type: Boolean,
  default: false,
},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Post', postSchema);
