var Question = require("./question");

var Session = function (id, currentQuestion) {
  this.id = id;
  this.currentQuestion = currentQuestion || new Question(null, null, null);
}


module.exports = Session;