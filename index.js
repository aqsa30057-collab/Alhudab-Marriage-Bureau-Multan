const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "alhuda123";
const WHATSAPP_TOKEN = "YAHAN_APNA_ACCESS_TOKEN_LIKHO";
const PHONE_NUMBER_ID = "1141866679012205";

// Webhook verify
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Messages receive karo
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.object === 'whatsapp_business_account') {
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body || '';
      const reply = await getAIReply(text);
      await sendMessage(from, reply);
    }
  }
  res.sendStatus(200);
});

// AI reply
async function getAIReply(userMessage) {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You are a helpful assistant for Alhuda Marriage Bureau in Multan, Pakistan. 
      Answer all questions in Urdu or English based on what the client uses.
      Bureau details:
      - Name: Alhuda Marriage Bureau
      - Location: Multan, Pakistan
      - Registration Fee: Rs. 15,000 (discounted from Rs. 25,000)
      - Services: Rishta matching, profile creation, confidential meetings
      - Contact: Available via WhatsApp
      Always be polite, professional and helpful.
