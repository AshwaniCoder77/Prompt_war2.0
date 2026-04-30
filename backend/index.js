const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// EMERGENCY TEST MODE
console.log("!!! EMERGENCY TEST MODE STARTING !!!");

app.get('/api/health', (req, res) => {
    console.log("Health check hit!");
    res.json({ status: 'ok', time: new Date() });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`!!! SERVER IS LIVE ON PORT ${PORT} !!!`);
});

server.on('error', (err) => {
    console.error("SERVER ERROR:", err);
});
