const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


async function fetchGeminiWithRetry(url, options, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await fetch(url, options);

        if (
            response.ok ||
            ![429, 500, 502, 503, 504].includes(response.status) ||
            attempt === maxAttempts
        ) {
            return response;
        }

        const delayMs = 1000 * (2 ** (attempt - 1));
        console.warn(
            `Gemini returned ${response.status}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxAttempts}).`
        );

        await response.arrayBuffer();
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
}

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

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(503).json({
                success: false,
                message: "Gemini API is not configured on the server."
            });
        }

        const response = await fetchGeminiWithRetry(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{
                        text: `You are a helpful, accurate AI assistant inside VibeChat.

LANGUAGE:
- Reply in the same language and style as the user's message.
- For Hinglish written in Roman script, reply in natural Roman Hinglish.
- Use Hindi script only when the user writes in Hindi script or requests it.

QUALITY:
- Answer the exact question directly.
- Use clear headings and bullet points when useful.
- Do not repeat recommendations or sentences.
- Never invent facts, addresses, prices, opening hours, or travel details.
- Clearly state uncertainty when you cannot verify something.
- Keep simple answers concise and detailed answers well organized.
- Do not claim to be the official ChatGPT or an OpenAI model.`
                    }]
                },
                contents: [{
                    role: "user",
                    parts: [{ text: message.trim() }]
                }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 800
                }
            }),
            signal: AbortSignal.timeout(60000)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Gemini API returned status:", response.status);
            console.error("Gemini API error details:", errorDetails.slice(0, 2000));

            if (response.status === 429) {
                return res.status(429).json({
                    success: false,
                    message: "Gemini usage limit reached. Please try again later."
                });
            }

            return res.status(502).json({
                success: false,
                message: "Gemini could not process the request. Please try again."
            });
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!answer) {
            return res.status(502).json({
                success: false,
                message: "Gemini returned an empty response."
            });
        }

        return res.json({
            success: true,
            answer
        });
    } catch (error) {
        console.error("Gemini request failed:", error.message);

        const timedOut = error.name === "TimeoutError";

        return res.status(timedOut ? 504 : 502).json({
            success: false,
            message: timedOut
                ? "The AI response timed out. Please try again."
                : "Unable to connect to Gemini. Please try again later."
        });
    }
});

module.exports = router;
