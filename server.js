const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, '')));

// Default route to handle Angular routes (for RouterModule)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Start the server
app.listen(80, () => {
  console.log('Server running on http://localhost:80');
});
