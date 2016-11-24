/* The purpose of this file is to setup the server for handling the backend. */

// Set up the app.
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

// Load environment variables from .env file
require('dotenv').load();

require('./routes/routes')(app);

var reportService = require('./services/reportService');
var emailListService = require('./services/emailListService');

// Start the server.
app.listen(3000, function() {
  console.log('App started. Listening to port 3000.');
});

var reportTimer = process.env.REPORT_TIMER_MS || 86400000;

// Set timer for report emails.
setInterval(function () {
  reportService.sendReport(function (err) {
    if (err) {
      console.log(err);
    }
  })
}, reportTimer);

var emailListTimer = process.env.REPORT_TIMER_MS || 86400000;

// Set timer for email list emails.
setInterval(function () {
  emailListService.sendEmailList(function (err) {
    if (err) {
      console.log(err);
    }
  })
}, emailListTimer);