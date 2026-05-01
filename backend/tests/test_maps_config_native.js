const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/config/maps',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('✅ Maps Config Response:', JSON.parse(data));
  });
});

req.on('error', (err) => {
  console.error('❌ Failed to connect:', err.message);
});

req.end();
