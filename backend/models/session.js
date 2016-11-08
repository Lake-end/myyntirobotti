var Question = require("./question");

var Session = function (id, currentQuestion, answers) {
  this.id = id;
  this.currentQuestion = currentQuestion || new Question(null, null, null);
  this.answers = answers || [];
}

Session.prototype.prepareForJSON = function () {
  var answerIds = []

  for (i = 0; i < this.answers.length; i++) {
    answerIds.push(this.answers[i].id);
  }

  this.answers = answerIds;

  this.current_question = this.currentQuestion.id;
  delete this.currentQuestion;

  return this;
}

module.exports = Session;