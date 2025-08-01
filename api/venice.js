const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// POST /api/qwen/chat
router.post('/chat-venice', async (req, res) => {
  const { message, model } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yourdomain.com', // thay bằng URL thật nếu bạn muốn ranking
        'X-Title': 'MyApp Chat'
      },
      body: JSON.stringify({
        model: model || 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'OpenRouter Error', details: data.error });
    }

    res.json({
      success: true,
      message: data.choices[0]?.message || {},
      usage: data.usage || {}
    });

  } catch (error) {
    console.error('❌ Error calling OpenRouter:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
