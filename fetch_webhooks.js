const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'api.resend.com',
  port: 443,
  path: '/webhooks',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer re_ikc6Lxw5_Nas1LoakZvaGN1oybWkAQQAg'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    fs.writeFileSync('webhooks_output.json', body, 'utf8');
    console.log('Saved webhooks to webhooks_output.json');
  });
});

req.on('error', (e) => console.error(e));
req.end();
