var Session = require('./session');
var Question = require('./question');
var Answer = require('./answer');

var SessionAnswer = function (id, timestamp, session, question, answer, linkClicked) {
  this.id = id;
  this.timestamp = timestamp || new Date();
  this.session = session || new Session(null, null, null);
  this.question = question || new Question(null, null, null);
  this.answer = answer || new Answer(null, null, null);
  this.linkClicked = linkClicked || false;
}

module.exports = SessionAnswer;