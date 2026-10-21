const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const AYU_AI_URL = process.env.AYU_AI_URL;

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

        if (!AYU_AI_URL) {
            return res.status(503).json({
                success: false,
                message: "Ayu AI is not configured on the server."
            });
        }

        const response = await fetch(AYU_AI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message.trim()
            }),
            signal: AbortSignal.timeout(120000)
        });

        if (!response.ok) {
            console.error("Ayu AI returned status:", response.status);

            return res.status(502).json({
                success: false,
                message: "Ayu AI could not process the request. Please try again."
            });
        }

        if (!response.body) {
            return res.status(502).json({
                success: false,
                message: "Ayu AI returned an empty response."
            });
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let answer = "";

        while (true) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line.trim()) {
                    continue;
                }

                try {
                    const chunk = JSON.parse(line);

                    if (typeof chunk.token === "string") {
                        answer += chunk.token;
                    }

                    if (chunk.error) {
                        throw new Error("Ayu AI stream returned an error.");
                    }
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        console.error("Invalid JSON received from Ayu AI.");
                        continue;
                    }

                    throw error;
                }
            }
        }

        if (buffer.trim()) {
            try {
                const chunk = JSON.parse(buffer);

                if (typeof chunk.token === "string") {
                    answer += chunk.token;
                }
            } catch {
                console.warn("Ignored incomplete final Ayu AI stream chunk.");
            }
        }

        if (!answer.trim()) {
            return res.status(502).json({
                success: false,
                message: "Ayu AI returned an empty response."
            });
        }

        return res.json({
            success: true,
            answer: answer.trim()
        });
    } catch (error) {
        console.error("Ayu AI request failed:", error.message);

        return res.status(
            error.name === "TimeoutError" ? 504 : 502
        ).json({
            success: false,
            message: error.name === "TimeoutError"
                ? "Ayu AI response timed out. Please try again."
                : "Unable to connect to Ayu AI. Please try again later."
        });
    }
});

module.exports = router;
