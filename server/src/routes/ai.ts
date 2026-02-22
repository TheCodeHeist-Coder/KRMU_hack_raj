import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

function getGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
        throw new Error('Gemini API key not configured');
    }
    return new GoogleGenerativeAI(apiKey);
}

// POST /api/ai/improve — Improve complaint description + detect severity
router.post('/improve', rateLimiter(10, 60 * 1000), async (req: Request, res: Response): Promise<void> => {
    try {
        const { description } = req.body;
        if (!description || description.length < 20) {
            res.status(400).json({ error: 'Description too short' });
            return;
        }

        const genAI = getGemini();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a professional complaint documentation assistant for a POSH (Prevention of Sexual Harassment) compliance system in India.

A workplace harassment complaint has been submitted with the following description:
"${description}"

Your tasks:
1. Rewrite the description in clear, professional, factual language suitable for a formal complaint. Keep all key facts intact. Do not add assumptions.
2. Detect the severity level: Low (minor/single incident), Medium (repeated/moderate), or High (severe/threatening/assault).
3. Provide a brief supportive guidance message (1-2 sentences) encouraging the reporter.

Respond ONLY in this exact JSON format:
{
  "improvedText": "...",
  "detectedSeverity": "Low|Medium|High",
  "guidanceMessage": "..."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            res.status(500).json({ error: 'AI response parsing failed' });
            return;
        }
        const parsed = JSON.parse(jsonMatch[0]);
        res.json(parsed);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'AI service unavailable';
        res.status(503).json({ error: msg });
    }
});

// POST /api/ai/guidance — POSH guidance chatbot
router.post('/guidance', rateLimiter(20, 60 * 1000), async (req: Request, res: Response): Promise<void> => {
    try {
        const { question } = req.body;
        if (!question) {
            res.status(400).json({ error: 'Question is required' });
            return;
        }

        const genAI = getGemini();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a POSH Act (Prevention of Sexual Harassment at Workplace Act, 2013) guidance assistant for Indian workplaces.

Answer the following question in a supportive, informative, and non-judgmental way:
"${question}"

Important rules:
- Do NOT give legal verdicts or accuse individuals
- Do NOT replace official investigation
- Provide factual information about the POSH Act and ICC process
- Keep response under 200 words
- Be empathetic and encouraging`;

        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'AI service unavailable';
        res.status(503).json({ error: msg });
    }
});

export default router;
