/* The purpose of this file is to setup the server for handling the backend. */

// Set up the app.
var express = require('express');
var app = express();

require('./routes/routes')(app);

// Start the server.
app.listen(3000, function() {
  console.log('App started. Listening to port 3000.');
});