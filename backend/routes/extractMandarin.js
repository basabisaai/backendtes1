const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/extract-mandarin', async (req, res) => {
  const { text } = req.body;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const prompt = `You are a helper that extracts Mandarin phrases from mixed sentences.
Return ONLY the Mandarin phrase the user is asking about.

Examples:
Input: "Can you check my pronunciation ni hao ma?"
Output: ni hao ma

Input: "Evaluate how I say 你好"
Output: 你好

Input: "Hello"
Output: <none>

Now extract from: "${text}"`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 20,
      temperature: 0
    })
  });

  const data = await response.json();
  const raw = data.choices[0]?.message?.content?.trim();

  const phrase = raw.toLowerCase() === "<none>" ? null : raw;
  res.json({ phrase });
});

module.exports = router;
