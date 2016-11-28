var Question = require('../question');

var AnalyticsEntry = function (question, answerCounts) {
  this.question = question || new Question();
  this.answerCounts = answerCounts || new Map();
}

module.exports = AnalyticsEntry;