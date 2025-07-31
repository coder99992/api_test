const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

// Khởi tạo OpenAI client
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

// API endpoint cho chat KIWI
router.post('/chat-kiwi', async (req, res) => {
    const { message, model } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const chatCompletion = await client.chat.completions.create({
            model: model || "moonshotai/Kimi-K2-Instruct:novita",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        });
        res.json(chatCompletion.choices[0].message);
    } catch (error) {
        console.error('Error during chat completion:', error);
        res.status(500).json({ error: 'Failed to get chat completion' });
    }
});

module.exports = router;