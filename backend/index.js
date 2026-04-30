const http = require('http');

console.log("!!! NUCLEAR TEST MODE STARTING !!!");

const server = http.createServer((req, res) => {
  console.log("Request received:", req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Cloud Run is working!\n');
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`!!! NUCLEAR SERVER IS LIVE ON PORT ${PORT} !!!`);
});

server.on('error', (err) => {
  console.error("NUCLEAR SERVER ERROR:", err);
});
