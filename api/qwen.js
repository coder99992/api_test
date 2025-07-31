const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

// Khởi tạo client Hugging Face với model Qwen
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

router.post('/chat-qwen', async (req, res) => {
    const { message, model } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const chatCompletion = await client.chat.completions.create({
            model: model || "Qwen/Qwen3-Coder-480B-A35B-Instruct:novita", // default
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