// Simple endpoint testing script
console.log('🧪 Testing Meta Messenger Webhook endpoints...\n');

// Test health endpoint
console.log('1. Testing health endpoint (GET /)...');
try {
  const healthResponse = await fetch('http://localhost:3001/');
  const healthData = await healthResponse.json();
  console.log('✅ Health check response:', JSON.stringify(healthData, null, 2));
} catch (error) {
  console.log('❌ Health check failed:', error.message);
}

// Test webhook verification
console.log('\n2. Testing webhook verification (GET /webhook)...');
try {
  const webhookResponse = await fetch('http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=meta_test_webhook_2024&hub.challenge=test123');
  const webhookText = await webhookResponse.text();
  console.log('✅ Webhook verification response:', webhookText);
} catch (error) {
  console.log('❌ Webhook verification failed:', error.message);
}

// Test send endpoint (will fail without proper credentials, but should show structure)
console.log('\n3. Testing send endpoint (POST /send)...');
try {
  const sendResponse = await fetch('http://localhost:3001/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const sendData = await sendResponse.json();
  console.log('📤 Send endpoint response:', JSON.stringify(sendData, null, 2));
} catch (error) {
  console.log('❌ Send endpoint failed:', error.message);
}

console.log('\n✨ Endpoint testing complete!');
