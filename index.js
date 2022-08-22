// Express setup
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware for allowing Cross-Origin
app.use(cors());

// Middleware for serving static files
app.use(express.static('public'));

// If local, set server to listen on 8080. If deployed, let the environment variable decide
app.listen(process.env.PORT || 8080, function () {
    console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
});
