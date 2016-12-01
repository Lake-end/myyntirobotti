var Question = require('../question');
var Contact = require('../contact');

var ReportRow = function (userId, ip, startTime, endTime, answerMap, contact) {
  this.userId = userId || null;
  this.ip = ip || null;
  this.startTime = startTime|| null;
  this.endTime = endTime || null;
  this.answerMap = answerMap || new Map();
  this.contact = contact || new Contact();
}

module.exports = ReportRow