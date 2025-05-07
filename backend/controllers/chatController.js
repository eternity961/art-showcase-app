const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chatbot response
exports.chatWithBot = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    // Request to Gemini API for a response
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    const response = result.response.text(); // Get response from the model

    res.json({ response });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Chatbot error', details: err.message });
  }
};
