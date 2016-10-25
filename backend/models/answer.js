var Answer = function (id, text, nextQuestion) {
  this.id = id || null;
  this.text = text || '';
  this.nextQuestion = nextQuestion || null;
};

// Prepares the object to be returned to the frontend.
Answer.prototype.prepareForJSON = function () {
  this.qid = this.nextQuestion;
  this.answer = this.text;
  delete this.nextQuestion;
  delete this.text;

  return this;
}

module.exports = Answer;