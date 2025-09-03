const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to get the talks data
app.get('/api/talks', (req, res) => {
  fs.readFile(path.join(__dirname, 'talks.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading talks data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
