import express from 'express';

const router = express.Router();

const SYSTEM_PROMPT = `You are AlgoVault AI Assistant, an expert computer science, Data Structures & Algorithms (DSA), Operating Systems (OS), Database Management Systems (DBMS & SQL), Computer Networks (CN), System Design, Object-Oriented Programming (OOP), and JavaScript interview preparation tutor.
Provide clear, structured, concise, and highly educational answers. Use clean code snippets with explanations whenever relevant. Keep answers engaging and easy to understand.`;

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'SARVAM_API_KEY is missing on backend server.' });
    }

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
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
      return res.status(sarvamRes.status).json({
        success: false,
        message: 'Failed to fetch AI response from Sarvam AI.',
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
      message: error.message || 'Internal server error in Chat service.',
    });
  }
});

export default router;
