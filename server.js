import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variables
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'your_verify_token_here';
const HARDCODED_PSID = process.env.HARDCODED_PSID;

console.log('🚀 Server starting...');
console.log('📝 Environment check:');
console.log('- PAGE_ACCESS_TOKEN:', PAGE_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');
console.log('- VERIFY_TOKEN:', VERIFY_TOKEN ? '✅ Set' : '❌ Missing');
console.log('- HARDCODED_PSID:', HARDCODED_PSID ? '✅ Set' : '❌ Missing');

// GET /webhook - Webhook verification and message receiving
app.get('/webhook', (req, res) => {
  console.log('\n🔍 Webhook GET request received');
  console.log('Query params:', req.query);

  // Webhook verification
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    console.log('❌ Missing verification parameters');
    res.sendStatus(400);
  }
});

// POST /webhook - Receive incoming messages
app.post('/webhook', (req, res) => {
  console.log('\n📨 Incoming webhook POST request');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      console.log('📩 Webhook event:', JSON.stringify(webhookEvent, null, 2));

      if (webhookEvent.message) {
        console.log('💬 Message received from PSID:', webhookEvent.sender.id);
        console.log('💬 Message text:', webhookEvent.message.text);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// POST /send - Send message to hardcoded PSID
app.post('/send', async (req, res) => {
  console.log('\n📤 Send message request received');

  if (!PAGE_ACCESS_TOKEN) {
    console.log('❌ PAGE_ACCESS_TOKEN not configured');
    return res.status(500).json({ error: 'PAGE_ACCESS_TOKEN not configured' });
  }

  if (!HARDCODED_PSID) {
    console.log('❌ HARDCODED_PSID not configured');
    return res.status(500).json({ error: 'HARDCODED_PSID not configured' });
  }

  const messageData = {
    recipient: {
      id: HARDCODED_PSID
    },
    message: {
      text: "Hello from my bot"
    }
  };

  console.log('📝 Sending message:', JSON.stringify(messageData, null, 2));

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
    console.log('📨 Facebook API response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Message sent successfully');
      res.json({ success: true, response: result });
    } else {
      console.log('❌ Failed to send message:', result.error);
      res.status(response.status).json({ error: result.error });
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Meta Messenger Webhook Test Server',
    endpoints: {
      'GET /webhook': 'Webhook verification and message receiving',
      'POST /send': 'Send message to hardcoded PSID',
      'GET /': 'This health check'
    },
    environment: {
      PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN ? 'Configured' : 'Missing',
      VERIFY_TOKEN: VERIFY_TOKEN ? 'Configured' : 'Missing',
      HARDCODED_PSID: HARDCODED_PSID ? 'Configured' : 'Missing'
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🌟 Server running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`📤 Send URL: http://localhost:${PORT}/send`);
  console.log(`🏥 Health check: http://localhost:${PORT}/`);
});
