const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();

// Add basic authentication
app.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || 'dashboard2024'
    },
    challenge: true,
    realm: 'Streaming Dashboard'
}));

// Serve static files
app.use(express.static('public'));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Dashboard running on port ${port}`);
});

module.exports = app;