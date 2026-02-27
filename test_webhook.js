const crypto = require('crypto');
const https = require('https');

const secret = 'whsec_jWKLNrhmT6uQvNGwPIsD74exNXnxrw6H';
const payload = {
  "type": "email.received",
  "created_at": new Date().toISOString(),
  "data": {
    "created_at": new Date().toISOString(),
    "from": "test@example.com",
    "to": ["marcus@jonnyai.co.uk"],
    "subject": "System Verify: Direct Webhook Post",
    "html": "<p>This is a direct bypass test generated physically via Node.js to evaluate the API route.</p>",
    "text": "This is a direct bypass test generated physically via Node.js to evaluate the API route."
  }
};

const payloadString = JSON.stringify(payload);
const timestamp = Math.floor(Date.now() / 1000).toString();
const msgId = 'msg_' + crypto.randomBytes(16).toString('hex');

const signaturePayload = `${msgId}.${timestamp}.${payloadString}`;
const secretBytes = Buffer.from(secret.replace('whsec_', ''), 'base64');
const signature = crypto.createHmac('sha256', secretBytes).update(signaturePayload).digest('base64');

const options = {
  hostname: 'jonnyai.co.uk',
  port: 443,
  path: '/api/inbound',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'svix-id': msgId,
    'svix-timestamp': timestamp,
    'svix-signature': `v1,${signature}`
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => console.error(e));
req.write(payloadString);
req.end();
