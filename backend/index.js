/* The purpose of this file is to setup the server for handling the backend. */

// Set up the app.
var express = require('express');
var bodyParser = require('body-parser');
var emailService = require('./services/emailService');
var app = express();

app.use(bodyParser.json());

// Load environment variables from .env file
require('dotenv').load();

require('./routes/routes')(app);

// Start the server.
app.listen(3000, function() {
  console.log('App started. Listening to port 3000.');
});

// Set timer for report emails.
// setInterval(function() {emailService.sendReportMail()}, 10000); // 10 seconds
// setInterval(function() {emailService.sendReportMail()}, 43200000); // 12 hours