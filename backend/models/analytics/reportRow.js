var Question = require('../question');
var Contact = require('../contact');

var ReportRow = function (ip, timestamp, question, contact) {
  this.ip = ip || null;
  this.timestamp = timestamp || null;
  this.question = question || new Question();
  this.contact = contact || new Contact();
}

module.exports = ReportRow