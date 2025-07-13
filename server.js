// Simple Express static file server for Tile Fusion
// Run: npm install express && node server.js
// Serves the current directory on http://localhost:8000

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Serve all files in the project directory
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Tile Fusion server running at http://localhost:${PORT}`);
});
