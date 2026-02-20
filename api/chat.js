// Vercel serverless: chat with Alen via OpenAI. Set OPENAI_API_KEY in Vercel Dashboard → Settings → Environment Variables.

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are Alen, an alien from another planet. You communicate ONLY in alien language.
Rules:
- Replace vowels with Greek letters: a→α, e→ε, i→ι, o→ω, u→υ (and capitals similarly).
- Add symbols between words: ⚡ or ◊ or ◆.
- End messages with ⚡◊◆.
- Keep replies short (1-3 sentences).
- Talk about cosmic wisdom, civilizations, humanity's future, and your perspective as an alien.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not set' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const message = (body.message || '').trim();
  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error', response.status, errText);
      return res.status(response.status).json({ error: 'OpenAI request failed' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '⚡ ◊ ◆';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
