// Setup Status Checker for Meta Messenger Webhook Test
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config();

console.log('🔍 Meta Messenger Webhook Test - Setup Status Check\n');

// Check if .env file exists
console.log('📄 Environment File:');
if (existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file missing - copy from .env.example');
}

// Check environment variables
console.log('\n🔧 Environment Variables:');
const requiredVars = [
  'PAGE_ACCESS_TOKEN',
  'VERIFY_TOKEN',
  'HARDCODED_PSID'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `your_${varName.toLowerCase().replace('_', '_')}_here`) {
    console.log(`✅ ${varName}: Configured`);
  } else {
    console.log(`❌ ${varName}: Not configured (still has placeholder value)`);
  }
});

// Check server accessibility
console.log('\n🌐 Server Status:');
try {
  const response = await fetch('http://localhost:3001/');
  if (response.ok) {
    console.log('✅ Server is running on port 3001');

    // Test webhook verification
    const webhookTest = await fetch('http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=meta_test_webhook_2024&hub.challenge=test123');
    if (webhookTest.ok) {
      console.log('✅ Webhook verification endpoint working');
    } else {
      console.log('❌ Webhook verification endpoint failed');
    }
  } else {
    console.log('❌ Server responded with error status');
  }
} catch (error) {
  console.log('❌ Server not running - start with: bun run server');
}

// Check dependencies
console.log('\n📦 Dependencies:');
try {
  const packageJson = JSON.parse(await import('fs').then(fs => fs.readFileSync('package.json', 'utf8')));
  const requiredDeps = ['express', 'cors', 'dotenv'];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: Installed`);
    } else {
      console.log(`❌ ${dep}: Missing`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Next steps guidance
console.log('\n📋 Next Steps:');
if (!process.env.PAGE_ACCESS_TOKEN || process.env.PAGE_ACCESS_TOKEN === 'your_page_access_token_here') {
  console.log('1. 🔑 Get Page Access Token from Meta Developer Console');
  console.log('   - Go to developers.facebook.com');
  console.log('   - Create Business app with Messenger product');
  console.log('   - Generate Page Access Token');
  console.log('   - Update .env file');
}

if (!process.env.HARDCODED_PSID || process.env.HARDCODED_PSID === 'your_facebook_user_id_here') {
  console.log('2. 👤 Get your Facebook User ID (PSID)');
  console.log('   - Use Graph API Explorer with user token');
  console.log('   - Query: me?fields=id,name');
  console.log('   - Copy the id value to .env file');
}

console.log('3. 🌐 Set up ngrok tunnel');
console.log('   - Install: npm install -g ngrok');
console.log('   - Run: ngrok http 3001');
console.log('   - Configure webhook URL in Meta Console');

console.log('4. 🔗 Configure webhooks in Meta Developer Console');
console.log('   - Set callback URL to ngrok HTTPS endpoint');
console.log('   - Subscribe to messages field');
console.log('   - Subscribe app to your page');

console.log('\n✨ Run this script anytime to check your setup status!');
console.log('📖 See SETUP_GUIDE.md for detailed instructions');
