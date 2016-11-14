var pgp = require('pg-promise')();

var databaseName;
var username;
var password;
var host;

if (process.env.NODE_ENV == 'test') {
  databaseName = process.env.TEST_DATABASE_NAME;
  username = process.env.TEST_DATABASE_USERNAME;
  password = process.env.TEST_DATABASE_PASSWORD;
  host = process.env.TEST_DATABASE_HOST;
} else {
  databaseName = process.env.DATABASE_NAME;
  username = process.env.DATABASE_USERNAME;
  password = process.env.DATABASE_PASSWORD;
  host = process.env.DATABASE_HOST;
}

var connection = `postgres://${username}:${password}@${host}/${databaseName}`;

var db = pgp(connection);

module.exports = db;