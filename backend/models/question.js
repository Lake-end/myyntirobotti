var Question = function (id, text, answers, containsLink) {
  this.id = id || 0;
  this.text = text || '';
  this.answers = answers || [];
  this.containsLink = containsLink || false;
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

  this.contains_link = this.containsLink;
  delete this.containsLink;

  return this
}

module.exports = Question;

