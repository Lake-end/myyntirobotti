var Question = function (id, text, answers) {
  this.id = id || 0;
  this.text = text || '';
  this.answers = answers || [];
};

// Prepares the object to be returned to the frontend.
Question.prototype.prepareForJSON = function () {
  var parsedAnswers = [];

  for (i = 0; i < this.answers.length; i++) {
    parsedAnswers.push(this.answers[i].prepareForJSON());
  }

  this.answers = parsedAnswers;

  this.question = this.text;
  delete this.text;

  return this
}

module.exports = Question;

