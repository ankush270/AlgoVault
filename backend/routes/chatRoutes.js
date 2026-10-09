import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are DevForge AI Assistant, an expert computer science, DSA, DBMS, OS, Networks, System Design, and JavaScript interview preparation tutor.

CRITICAL FORMATTING RULES:
1. Write clean, direct, concise, and easy-to-read text in simple natural language.
2. DO NOT use markdown headers (like ##, ###, ####), DO NOT use horizontal dividers (like --- or ***), DO NOT use markdown tables (|---|), and DO NOT use bold double asterisks (**text**).
3. Use simple bullet points (-) or numbered lists (1, 2, 3) for lists.
4. For code snippets, use clean code blocks with language specification.`;

const MAX_MESSAGE_CHAR_LIMIT = 4000;
const MAX_TOTAL_CHAR_LIMIT = 25000;
const MAX_MESSAGES_COUNT = 30;

// 1. CHAT COMPLETIONS Endpoint (Protected by Auth, Rate Limiter, and Message Length Caps)
router.post('/', authenticateToken, chatRateLimiter, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required and cannot be empty.'
      });
    }

    if (messages.length > MAX_MESSAGES_COUNT) {
      return res.status(400).json({
        success: false,
        message: `Too many messages in history (maximum ${MAX_MESSAGES_COUNT} allowed).`
      });
    }

    let totalChars = 0;
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (!m || typeof m.content !== 'string') {
        return res.status(400).json({
          success: false,
          message: `Message at index ${i} has invalid or missing content.`
        });
      }
      if (m.content.length > MAX_MESSAGE_CHAR_LIMIT) {
        return res.status(400).json({
          success: false,
          message: `Message at index ${i} exceeds maximum allowed character length of ${MAX_MESSAGE_CHAR_LIMIT}.`
        });
      }
      totalChars += m.content.length;
    }

    if (totalChars > MAX_TOTAL_CHAR_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Total chat payload exceeds allowed length (${MAX_TOTAL_CHAR_LIMIT} characters).`
      });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error('SARVAM_API_KEY is missing on backend server.');
      return res.status(500).json({
        success: false,
        message: 'AI Service is currently unavailable. Please contact the administrator.'
      });
    }

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content.trim(),
      })),
    ];

    const sarvamRes = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages: formattedMessages,
        temperature: 0.3,
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error('Sarvam AI Error:', sarvamRes.status, errText);
      return res.status(502).json({
        success: false,
        message: 'AI model service returned an error. Please try again shortly.',
      });
    }

    const data = await sarvamRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request. Please try again later.',
    });
  }
});

// 2. CODE REVIEW Endpoint (Protected by Auth, Rate Limiter, and Code Length Caps)
router.post('/code-review', authenticateToken, chatRateLimiter, async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid code string is required for analysis.' });
    }

    if (code.length > 25000) {
      return res.status(400).json({ success: false, message: 'Code snippet exceeds maximum limit of 25,000 characters.' });
    }

    const safeLanguage = typeof language === 'string' ? language.slice(0, 50) : 'javascript';
    const safeTitle = typeof problemTitle === 'string' ? problemTitle.slice(0, 200) : 'DSA Problem';
    const safeDesc = typeof problemDescription === 'string' ? problemDescription.slice(0, 3000) : '';

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error('SARVAM_API_KEY is missing on backend server.');
      return res.status(503).json({
        success: false,
        message: 'AI Code Review service is currently unconfigured or unavailable.'
      });
    }

    const prompt = `You are a Principal Software Engineer at Google/Meta reviewing code for a technical interview.
Analyze the following ${safeLanguage} solution for problem "${safeTitle}".

Problem Description: ${safeDesc || 'N/A'}

User Code:
\`\`\`${safeLanguage}
${code}
\`\`\`

Respond STRICTLY with valid JSON (no extra markdown outside JSON) with keys:
- "timeComplexity": string (e.g. "O(N log N)")
- "spaceComplexity": string (e.g. "O(N)")
- "isOptimal": boolean
- "codeQualityScore": number (between 0 and 100)
- "suggestions": array of strings
- "optimalSnippet": string (refined optimal code)`;

    const sarvamRes = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages: [
          { role: 'system', content: 'You are a code review assistant that outputs ONLY raw JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text().catch(() => '');
      console.error('Sarvam AI Code Review Error:', sarvamRes.status, errText);
      return res.status(502).json({
        success: false,
        message: 'AI code analysis service returned an error. Please try again shortly.'
      });
    }

    const data = await sarvamRes.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    
    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawContent;
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse AI review JSON response:', parseErr.message, rawContent);
      return res.status(502).json({
        success: false,
        message: 'AI model returned an unparseable response format. Please try again.'
      });
    }

    return res.json({
      success: true,
      timeComplexity: parsed.timeComplexity || 'O(N)',
      spaceComplexity: parsed.spaceComplexity || 'O(1)',
      isOptimal: parsed.isOptimal ?? false,
      codeQualityScore: typeof parsed.codeQualityScore === 'number' ? parsed.codeQualityScore : 70,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Review input validations and edge cases.'],
      optimalSnippet: parsed.optimalSnippet || code
    });
  } catch (error) {
    console.error('Code Review AI endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI code review. Please try again later.'
    });
  }
});


export default router;
