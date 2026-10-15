const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const AI_SERVER_URL = "http://127.0.0.1:8080/v1/chat/completions";

// POST /api/ai/chat
router.post("/chat", protect, async (req, res) => {
    try {
        const { message } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim() ||
            message.length > 4000
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a message between 1 and 4000 characters."
            });
        }

        const response = await fetch(AI_SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are VibeChat AI, a helpful general-purpose assistant. First understand what the user is asking, then answer that exact question directly. Do not reinterpret simple questions as unrelated topics. For example, if asked 'Bharat ki rajdhani kya hai?', answer 'Bharat ki rajdhani New Delhi hai.' Keep answers concise, factual, and relevant. Always reply in the same language as the user's latest message: English for English, Hindi for Hindi, and Hinglish for Hinglish. If you do not know an answer, say so instead of inventing information. Never invent your creator, company, or identity."
                    },
                    {
                        role: "user",
                        content: message.trim()
                    }
                ],
                temperature: 0.7,
                max_tokens: 300,
                stream: false
            }),
            signal: AbortSignal.timeout(60000)
        });

        if (!response.ok) {
            console.error("Local AI server returned status:", response.status);

            return res.status(502).json({
                success: false,
                message: "The local AI service could not process the request."
            });
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;

        if (!answer) {
            return res.status(502).json({
                success: false,
                message: "The local AI returned an empty response."
            });
        }

        return res.json({
            success: true,
            answer: answer.trim()
        });

    } catch (error) {
        console.error("VibeChat AI error:", error.message);

        const timedOut = error.name === "TimeoutError";

        return res.status(timedOut ? 504 : 502).json({
            success: false,
            message: timedOut
                ? "The AI response timed out. Please try again."
                : "Unable to connect to the local AI service. Make sure the AI server is running."
        });
    }
});

module.exports = router;
