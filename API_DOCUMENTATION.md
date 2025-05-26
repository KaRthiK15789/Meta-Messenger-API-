# API Documentation - Meta Messenger Webhook Test

## Overview

This document describes the two microservice endpoints created for the Meta Messenger webhook test project.

## Base URL
```
http://localhost:3001
```

## Endpoints

### 1. GET /webhook

**Purpose**: Webhook verification and incoming message reception

#### Webhook Verification (GET)
Facebook calls this endpoint to verify webhook ownership.

**Parameters** (Query String):
- `hub.mode` (string): Should be "subscribe"
- `hub.verify_token` (string): Must match VERIFY_TOKEN in environment
- `hub.challenge` (string): Challenge string to echo back

**Example Request**:
```bash
GET /webhook?hub.mode=subscribe&hub.verify_token=meta_test_webhook_2024&hub.challenge=test123
```

**Success Response** (200):
```
test123
```
Returns the hub.challenge value when verification succeeds.

**Error Responses**:
- `403 Forbidden`: Invalid verify token
- `400 Bad Request`: Missing parameters

#### Message Reception (POST)
Facebook sends incoming messages to this endpoint.

**Request Body** (JSON):
```json
{
  "object": "page",
  "entry": [
    {
      "id": "page_id",
      "time": 1234567890,
      "messaging": [
        {
          "sender": {
            "id": "user_psid"
          },
          "recipient": {
            "id": "page_id"
          },
          "timestamp": 1234567890,
          "message": {
            "mid": "message_id",
            "text": "Hello"
          }
        }
      ]
    }
  ]
}
```

**Success Response** (200):
```
EVENT_RECEIVED
```

**Console Logging**:
- Full webhook event payload
- Sender PSID
- Message text content
- Timestamp information

---

### 2. POST /send

**Purpose**: Send "Hello from my bot" message to hardcoded PSID

**Authentication**: Uses PAGE_ACCESS_TOKEN from environment

**Request**: No body required (message and recipient are hardcoded)

**Example Request**:
```bash
curl -X POST http://localhost:3001/send
```

**Internal Process**:
1. Validates PAGE_ACCESS_TOKEN exists
2. Validates HARDCODED_PSID exists
3. Constructs Facebook Graph API request
4. Calls `https://graph.facebook.com/v20.0/me/messages`
5. Returns response

**Message Payload Sent to Facebook**:
```json
{
  "recipient": {
    "id": "hardcoded_psid_from_env"
  },
  "message": {
    "text": "Hello from my bot"
  }
}
```

**Success Response** (200):
```json
{
  "success": true,
  "response": {
    "recipient_id": "user_psid",
    "message_id": "message_id"
  }
}
```

**Error Responses**:

**500 - Missing Configuration**:
```json
{
  "error": "PAGE_ACCESS_TOKEN not configured"
}
```
or
```json
{
  "error": "HARDCODED_PSID not configured"
}
```

**Facebook API Errors** (Various status codes):
```json
{
  "error": {
    "message": "Invalid OAuth access token",
    "type": "OAuthException",
    "code": 190,
    "fbtrace_id": "trace_id"
  }
}
```

**Console Logging**:
- Environment variable validation
- Message payload being sent
- Facebook API response (success or error)
- Network error details if applicable

---

### 3. GET /

**Purpose**: Health check and configuration status

**Example Request**:
```bash
curl http://localhost:3001/
```

**Response** (200):
```json
{
  "status": "Meta Messenger Webhook Test Server",
  "endpoints": {
    "GET /webhook": "Webhook verification and message receiving",
    "POST /send": "Send message to hardcoded PSID",
    "GET /": "This health check"
  },
  "environment": {
    "PAGE_ACCESS_TOKEN": "Configured",
    "VERIFY_TOKEN": "Configured",
    "HARDCODED_PSID": "Missing"
  }
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PAGE_ACCESS_TOKEN` | Facebook Page Access Token from Meta Console | `EAAxxxxxxxxxxxxx` |
| `VERIFY_TOKEN` | Custom string for webhook verification | `meta_test_webhook_2024` |
| `HARDCODED_PSID` | Facebook User ID for testing messages | `1234567890` |
| `PORT` | Server port (optional, defaults to 3001) | `3001` |

## Testing

### Manual Testing with curl

**Test webhook verification**:
```bash
curl "http://localhost:3001/webhook?hub.mode=subscribe&hub.verify_token=meta_test_webhook_2024&hub.challenge=test123"
# Expected: test123
```

**Test send endpoint**:
```bash
curl -X POST http://localhost:3001/send
# Expected: Success or error response based on configuration
```

**Test health check**:
```bash
curl http://localhost:3001/
# Expected: JSON status response
```

### Automated Testing

Run the included test script:
```bash
node test-endpoints.js
```

Run the setup checker:
```bash
node check-setup.js
```

## Integration with Facebook

### Required Facebook Setup:
1. Meta Business Developer App
2. Messenger product enabled
3. Webhooks product enabled
4. Page connected to app
5. Page Access Token generated
6. Webhook URL configured (via ngrok)
7. Messages field subscribed
8. App subscribed to page

### Webhook Flow:
1. User sends message to Facebook Page
2. Facebook POSTs to `/webhook` endpoint
3. Server logs message details
4. Manual trigger of `/send` endpoint
5. Server sends reply via Graph API
6. Reply appears in user's Messenger

## Error Handling

The server includes comprehensive error handling:
- Environment variable validation on startup
- Webhook verification parameter checking
- Facebook API error forwarding
- Network error catching
- Detailed console logging for debugging

## Security

- Webhook verification prevents unauthorized requests
- Environment variables protect sensitive tokens
- CORS enabled for web client access
- No sensitive data in responses (tokens masked)

## Monitoring

All requests and responses are logged to console with:
- Timestamps
- Full request/response payloads
- Error details
- Success/failure indicators
- Environment status checks
