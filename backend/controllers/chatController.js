const { GoogleGenerativeAI } = require('@google/generative-ai');
const { isAllowedMessage } = require('../utils/allowedMessages');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt to guide the chatbot
const SYSTEM_PROMPT = `You are a helpful assistant for the Art Showcase platform. You only answer questions related to the platform, such as profiles, posting, evaluations, and event rules. Politely decline unrelated queries.`;

// Chatbot controller
const chatWithBot = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message input' });
  }

  // Check if the question is relevant
  if (!isAllowedMessage(message)) {
    return res.json({
      reply: "I'm here to assist only with Art Showcase system-related queries. 🎨",
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'tunedModels/userfaq-ba60dvibs38ong5nis45roxxfbuwbsw6', // ✅ Replace with your actual model
    });

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message}`);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Error calling Gemini:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Something went wrong with Gemini API.' });
  }
};

module.exports = { chatWithBot };
