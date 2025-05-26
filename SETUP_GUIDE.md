# Step-by-Step Meta Developer Console Setup Guide

Follow these exact steps to configure your Meta Business App for the webhook test.

## Phase 1: Local Development Setup ✅ COMPLETE

Your local microservices are ready:
- Server running on port 3001
- GET /webhook for verification
- POST /send for messaging
- Environment variables configured

## Phase 2: Meta Business App Creation

### Step 1: Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Accept developer terms if prompted

### Step 2: Create New App
1. Click "Create App"
2. Select "Business" as app type
3. Fill in app details:
   - App Name: "Messenger Webhook Test"
   - App Contact Email: your email
   - Business Account: Create new or select existing
4. Click "Create App"

### Step 3: Add Products
1. In your app dashboard, find "Add Products to Your App"
2. Add **Messenger**:
   - Click "Set up" under Messenger
   - This adds Messenger API capabilities
3. Add **Webhooks**:
   - Click "Set up" under Webhooks
   - This enables webhook functionality

## Phase 3: Configure Messenger

### Step 1: Add Facebook Page
1. Go to Messenger → Settings
2. Scroll to "Access Tokens"
3. Click "Add or Remove Pages"
4. Select a Facebook Page you admin (create one if needed)
5. Grant required permissions

### Step 2: Generate Page Access Token
1. In "Access Tokens" section
2. Select your page from dropdown
3. Click "Generate Token"
4. **IMPORTANT**: Copy this token immediately
5. Update your `.env` file:
   ```bash
   PAGE_ACCESS_TOKEN=your_actual_token_here
   ```

## Phase 4: Setup ngrok Tunnel

### Step 1: Install ngrok
```bash
# Option 1: npm (if you have Node.js)
npm install -g ngrok

# Option 2: Download from https://ngrok.com/download
```

### Step 2: Start Tunnel
```bash
# Make sure your server is running first
cd meta-messenger-webhook-test
bun run server

# In another terminal
ngrok http 3001
```

### Step 3: Copy HTTPS URL
- ngrok will show URLs like:
  - HTTP: http://abc123.ngrok-free.app
  - **HTTPS**: https://abc123.ngrok-free.app ← Use this one
- Copy the HTTPS URL

## Phase 5: Configure Webhooks

### Step 1: Set Callback URL
1. Go to Webhooks → Configuration
2. Click "Edit" for Callback URL
3. Enter: `https://your-ngrok-url.ngrok-free.app/webhook`
4. Enter Verify Token: `meta_test_webhook_2024` (from your .env)
5. Click "Verify and Save"

### Step 2: Subscribe to Events
1. In "Webhook Fields" section
2. Check the **messages** checkbox
3. Click "Save"

### Step 3: Subscribe App to Page
1. Go to Webhooks → Configuration
2. In "Webhooks" section, find your page
3. Click "Subscribe" next to your page name

## Phase 6: Test API Access

### Step 1: Get Your PSID (Facebook User ID)
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Select "User Token"
4. Add permissions: `user_profile`
5. Click "Generate Access Token"
6. In the request field, enter: `me?fields=id,name`
7. Click "Submit"
8. Copy the `id` value - this is your PSID
9. Update your `.env` file:
   ```bash
   HARDCODED_PSID=your_facebook_user_id_here
   ```

### Step 2: Test Graph API
1. In Graph API Explorer
2. Select your app
3. Select "Page Access Token" (the one you generated)
4. Enter endpoint: `me/messages`
5. Click "Submit"
6. Should return `200 OK` with empty data

## Phase 7: End-to-End Testing

### Step 1: Restart Server
```bash
# Stop current server (Ctrl+C)
# Restart with new environment variables
cd meta-messenger-webhook-test
bun run server
```

### Step 2: Test Webhook Reception
1. Send a message to your Facebook Page from your personal account
2. Check your server console - should see webhook event logged
3. Look for message details in console output

### Step 3: Test Message Sending
```bash
# Test the send endpoint
curl -X POST http://localhost:3001/send
```
OR use Postman/Insomnia to POST to `http://localhost:3001/send`

### Step 4: Verify Reply
- Check your Messenger conversation with the page
- Should see "Hello from my bot" message

## Troubleshooting

### Common Issues:

1. **"Invalid OAuth access token"**
   - Check PAGE_ACCESS_TOKEN in .env
   - Regenerate token in Meta Console
   - Ensure token is for the correct page

2. **Webhook verification fails**
   - Check VERIFY_TOKEN matches in .env and Meta Console
   - Ensure ngrok tunnel is running
   - Verify HTTPS URL is correct

3. **No webhook events received**
   - Check ngrok tunnel is active
   - Verify webhook subscription to page
   - Ensure "messages" field is checked

4. **Cannot send messages**
   - Check HARDCODED_PSID is correct
   - Verify Page Access Token has send permissions
   - Check page is properly connected

## Final Checklist

- [ ] Meta Business App created
- [ ] Messenger and Webhooks products added
- [ ] Page Access Token generated and added to .env
- [ ] ngrok tunnel running and HTTPS URL configured
- [ ] Webhook verification successful
- [ ] Messages field subscribed
- [ ] App subscribed to page
- [ ] PSID obtained and added to .env
- [ ] Server restarted with new environment
- [ ] End-to-end test successful

## Success Indicators

✅ **Server Console Shows:**
- Environment variables all marked as "✅ Set"
- Webhook verification successful
- Incoming message events logged with full payload
- Outgoing message attempts with API responses

✅ **Meta Console Shows:**
- Green checkmarks for webhook verification
- Active subscription to page
- No error messages in webhook logs

✅ **Messenger Shows:**
- Messages from personal account to page
- Replies from page back to personal account
