// Express setup
const express = require('express');
const cors = require('cors');
const app = express();

const booksRoutes = require('./routes/books');

// Middleware for allowing Cross-Origin
app.use(cors());

app.use('/books', booksRoutes);

// Middleware for serving static files
app.use(express.static('public'));

// If local, set server to listen on 8080. If deployed, let the environment variable decide
app.listen(process.env.PORT || 8080, function () {
    console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
});
