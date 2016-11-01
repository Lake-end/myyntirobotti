var SessionAnswer = function (id, sessionId, timestamp, question, answer) {
  this.id = id;
  this.sessionId = sessionId;
  this.timestamp = timestamp;
  this.question = question || new Question(null, null, null);
  this.answer = answer || new Answer(null, null, null);
}

module.exports = SessionAnswer;