const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const AI_SERVER_URL = (process.env.AI_SERVER_URL || "http://127.0.0.1:8080/v1/chat/completions").replace(/\/+$/, "");

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
                "Content-Type": "application/json",
                ...(process.env.AI_GATEWAY_TOKEN
                    ? { "Authorization": `Bearer ${process.env.AI_GATEWAY_TOKEN}` }
                    : {})
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are VibeChat AI, a helpful and accurate assistant. Understand the user's exact question and answer it directly. For travel and local recommendations, suggest only places reasonably near the requested starting location. Never invent locations, distances, travel times, opening hours, prices, or facts. If you are unsure, clearly say so instead of guessing. For a day trip, suggest 3 to 5 realistic destinations and briefly explain why each is worth visiting. Keep the response organized, practical, and concise. Use bullet points when listing options. Always respond in the same language as the user's latest message, including Hindi or Hinglish when appropriate. For simple factual questions, give the answer first. Never invent your creator, company, or identity."
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
