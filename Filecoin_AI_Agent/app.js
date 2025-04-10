// app.js

const express = require('express');
const path = require('path');

const uploadRoute = require('./routes/upload');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/upload', uploadRoute);

// Optional future route: status check
// app.use('/status', require('./routes/status'));

module.exports = app;
