var pgp = require('pg-promise')();

var databaseName = process.env.DATABASE_NAME;
var username = process.env.DATABASE_USERNAME;
var password = process.env.DATABASE_PASSWORD;
var host = process.env.DATABASE_HOST;

var connection = `postgres://${username}:${password}@${host}/${databaseName}`

var db = pgp(connection);

module.exports = db;