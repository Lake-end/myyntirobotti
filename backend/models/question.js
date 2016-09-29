var Question = function (id, text) {
  this.id = id || 0;
  this.text = text || '';
};

Question.prototype.setText = function (text) {
  this.text = text;
};

Question.prototype.setId = function (id) {
  this.id = id;
};

module.exports = Question;

