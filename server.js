// Simple static server for LGTV-master structure
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from root
app.use(express.static(__dirname));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mega Radio TV App running on http://0.0.0.0:${PORT}`);
  console.log('📱 LGTV-master structure - static files served from root');
});
