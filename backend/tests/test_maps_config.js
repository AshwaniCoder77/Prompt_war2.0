const fetch = require('node-fetch');
const PORT = process.env.PORT || 8080;

async function testConfig() {
  try {
    const res = await fetch(`http://localhost:${PORT}/api/config/maps`);
    const data = await res.json();
    console.log('✅ Maps Config Response:', data);
  } catch (err) {
    console.error('❌ Failed to connect to backend:', err.message);
  }
}

testConfig();
