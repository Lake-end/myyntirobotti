var db = require ('../database/database');

var Question = require('../models/question');
var Answer = require('../models/answer');
var SessionAnswer = require('../models/sessionAnswer');

module.exports = {
  // Retrieves a single question with its answers
  getQuestion: function (id, callback) {
    db.many(
      ` SELECT a.id, q.text, q.contains_link AS question, a.text AS answer, qa.next_question FROM Answer a
        JOIN QuestionAnswer qa ON a.id=qa.answer_id
        JOIN Question q ON qa.question_id=q.id
        WHERE q.id=$1`,
        id
    ).then(function (data) {
      var answers = [];
      var questionText = '';
      var containsLink = '';

      for (i = 0; i < data.length; i++) {
        var answer = new Answer(data[i].id, data[i].answer, data[i].next_question);
        answers.push(answer);

        questionText = data[i].text;
        containsLink = data[i].contains_link;
      }

      var question = new Question(id, questionText, answers, containsLink);

      callback(null, question);
    })
    .catch(function (err) {
      callback(err);
    })
  },

  saveAnswer: function (sessionAnswer, callback) {
    var sessionId = sessionAnswer.session.id;
    var questionId = sessionAnswer.question.id;
    var answerId = sessionAnswer.answer.id;
    var linkClicked = sessionAnswer.linkClicked;

    db.tx(function (t) {
      return t.one("SELECT contains_link FROM Question WHERE id = $1", questionId)
        .then(function (containsLink) {
          if (containsLink) {
            return db.none(
              ` INSERT INTO SessionAnswer(
                timestamp,
                session_id,
                question_id,
                answer_id,
                link_clicked
              ) VALUES ($1, $2, $3, $4, $5)`,
              [new Date(), sessionId, questionId, answerId, linkClicked]);
          } else {
            return db.none(
              ` INSERT INTO SessionAnswer(
                timestamp,
                session_id,
                question_id,
                answer_id
              ) VALUES ($1, $2, $3, $4)`,
              [new Date(), sessionId, questionId, answerId]);
          }
        })
    })
      .then(function () {
        callback(null);
      })
      .catch(function (err) {
        callback(err);
      })
  }
};