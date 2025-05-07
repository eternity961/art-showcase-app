// utils/allowedMessages.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Define basic allowed keywords/phrases
const greetings = ['hello', 'hi', 'hey', 'good morning', 'good evening'];
const thanks = ['thank you', 'thanks', 'appreciate it'];
const artRelatedKeywords = [
  'art', 'artist', 'showcase', 'submit', 'post', 'evaluation', 'judge',
  'category', 'rank', 'score', 'feedback', 'like', 'comment'
];

// Normalize and tokenize input message
function normalize(text) {
  return tokenizer.tokenize(text.toLowerCase());
}

// Check if message is allowed
function isAllowedMessage(message) {
  const tokens = normalize(message);

  const hasGreeting = greetings.some(g => tokens.includes(g));
  const hasThanks = thanks.some(t => tokens.includes(t));
  const hasArtKeyword = artRelatedKeywords.some(k => tokens.includes(k));

  return hasGreeting || hasThanks || hasArtKeyword;
}

module.exports = { isAllowedMessage };
