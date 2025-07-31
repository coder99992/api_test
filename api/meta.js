const express = require('express');
const { OpenAI } = require('openai');

const router = express.Router();

// Initialize OpenAI client with Hugging Face configuration
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

// API endpoint for image + text chat
router.post('/chat-meta', async (req, res) => {
    try {
        const { imageUrl, text } = req.body;

        if (!imageUrl && !text) {
            return res.status(400).json({
                error: 'At least one of "text" or "imageUrl" must be provided.'
            });
        }

        const messages = [
            {
                role: "user",
                content: [],
            },
        ];

        if (text) {
            messages[0].content.push({
                type: "text",
                text: text,
            });
        }

        if (imageUrl) {
            messages[0].content.push({
                type: "image_url",
                image_url: {
                    url: imageUrl,
                },
            });
        }

        const chatCompletion = await client.chat.completions.create({
            model: "meta-llama/Llama-4-Scout-17B-16E-Instruct:novita",
            messages,
        });

        res.json({
            success: true,
            message: chatCompletion.choices[0].message,
            description: chatCompletion.choices[0].message.content
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router; // ✅ CHÍNH XÁC