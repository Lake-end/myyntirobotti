var db = require ('../database/database');

var Question = require('../models/question');
var Answer = require('../models/answer');

module.exports = {
  // Retrieves a single question with its answers
  getQuestion: function (id, callback) {
    db.any(
      ` SELECT a.id, q.text AS question, a.text AS answer, qa.next_question FROM Answer a
        JOIN QuestionAnswer qa ON a.id=qa.answer_id
        JOIN Question q ON qa.question_id=q.id
        WHERE q.id=$1`,
        id
    ).then(function (data) {
      var answers = [];
      var questionText = '';

      for (i = 0; i < data.length; i++) {
        var answer = new Answer(data[i].id, data[i].answer, data[i].next_question);
        answers.push(answer);

        questionText = data[i].question;
      }

      var question = new Question(id, questionText, answers);

      callback(null, question);
    })
  },
  
  saveAnswer: function (sessionId, questionId, answerId, callback) {
    db.none("INSERT INTO UserAnswer(timestamp, session_id, question_id, answer_id) VALUES ($1, $2, $3, $4)", 
      [new Date(), sessionId, questionId, answerId])
      .then(function () {
        callback();
      })
      .catch(function (err) {
        callback(err);
      })
  }
};