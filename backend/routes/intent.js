const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/intent', async (req, res) => {
  const { text } = req.body;
  console.log("📥 Received /intent request with text:", text);
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const prompt = `You are an intent classifier for a Mandarin learning app.

Classify the user's input into one of these two categories:
- pronunciation
- chat

Rules:
- If the user wants feedback on how they pronounced a phrase, classify as "pronunciation"
- If the user is asking for translations, grammar explanations, or general questions, classify as "chat"
- Always respond with one word only: either "pronunciation" or "chat"

User input: ${text}
Intent:`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 5,
      temperature: 0
    })
  });

  const data = await response.json();
  const raw = data.choices[0]?.message?.content?.trim().toLowerCase() || '';
  console.log("🧠 Intent raw response:", raw);

  let intent = 'chat'; // default
  if (raw === 'pronunciation' || raw === 'chat') {
    intent = raw;
  } else {
    console.warn("⚠️ Unexpected GPT intent format, defaulting to 'chat'");
  }

  res.json({ intent });
});


module.exports = router;
