var db = require('../database/database');

var Session = require('../models/session');
var Question = require('../models/question');
var Answer = require('../models/answer');
var SessionAnswer = require('../models/sessionAnswer');

var SessionNotFoundError = require('../libs/errors/sessionNotFoundError');

module.exports = {
  createSession: function (id, ip, callback) {
    if (id) {
      db.none("INSERT INTO Session(id, ip, current_question) VALUES ($1, $2, 1)", [id, ip])
        .then(function () {
          var question = new Question(1);
          var session = new Session(id, question);
          callback(null, session)
        })
        .catch(function (err) {
          callback(err);
        })
    } else {
      db.one("INSERT INTO Session(ip, current_question) VALUES ($1, 1) RETURNING id", ip)
        .then(function (id) {
          var question = new Question(1);
          var session = new Session(id, question);
          callback(null, session);
        })
        .catch(function (err) {
          callback(err);
        })
    }
  },

  getSession: function (id, callback) {
    db.manyOrNone(
      `SELECT s.id, s.current_question, sa.answer_id FROM Session s
       LEFT JOIN SessionAnswer sa ON sa.session_id = s.id
       WHERE s.id = $1
       ORDER BY sa.timestamp`,
      id
    )
      .then(function (data) {
        if (data.length > 0) {
          var currentQuestion = new Question(data[0].current_question)

          var answers = []
          for (i = 0; i < data.length; i++) {
            var answer = new Answer(data[i].answer_id)

            answers.push(answer);
          }

          var session = new Session(data[0].id, currentQuestion, answers);

          callback(null, session);
        } else {
          callback(new SessionNotFoundError(id));
        }
      })
      .catch(function (err) {
        callback(err);
      })
  },

  updateSession: function (id, currentQuestion, callback) {
    db.none("UPDATE Session SET current_question = $1 WHERE id = $2", [currentQuestion, id])
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (err) {
        callback(err);
      })
  },

  deleteSession: function (id, callback) {
    db.tx(function (t) {
      return t.none("UPDATE SessionAnswer SET session_id=null WHERE session_id=$1; UPDATE Contact SET session_id=null WHERE session_id=$1", id)
        .then(function (success) {
          return t.none("DELETE FROM Session WHERE id=$1", id);
        });
    })
      .then(function () {
        callback(null);
      })
      .catch(function (err) {
        callback(err)
      })
  },
  getSessionAnswers: function (id, callback) {
    db.manyOrNone(
      `SELECT q.id AS questionid, q.text AS questiontext, a.id AS answerid, a.text AS answertext, sa.link_clicked, s.id AS sessionid
    FROM Session s
    JOIN SessionAnswer sa ON s.id = sa.session_id
    JOIN Answer a ON sa.answer_id = a.id
    JOIN Question q ON sa.question_id = q.id
    WHERE s.id = $1
    ORDER BY a.id`,
      id
    )
      .then(function (data) {

        if (data.length > 0) {

          var answers = [];
          for (i = 0; i < data.length; i++) {
            var sessionAnswer = new SessionAnswer();

            sessionAnswer.question.id = data[i].questionid;
            sessionAnswer.question.text = data[i].questiontext;
            sessionAnswer.answer.id = data[i].answerid;
            sessionAnswer.answer.text = data[i].answertext;
            sessionAnswer.linkClicked = data[i].link_clicked;
            sessionAnswer.session.id = data[i].sessionid;

            answers.push(sessionAnswer);
          }
          callback(null, answers);
        } else {
          callback(new SessionNotFoundError(id));
        }
      })
      .catch(function (err) {
        callback(err);
      })
  }
};