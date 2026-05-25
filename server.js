const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  try {
    const { apiKey, messages, system } = req.body;
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({ error: 'Invalid API key.' });
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    const reply = data.content && data.content[0] ? data.content[0].text : "Sorry, I couldn't get a response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Oz Group chatbot running on port', PORT));
