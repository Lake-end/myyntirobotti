var db = require ('../database/database');

var Session = require('../models/session');
var Question = require('../models/question');
var Answer = require('../models/answer');

var SessionNotFoundError = require('../libs/errors/sessionNotFoundError');

module.exports = {
  getReportData: function (callback) {
    db.manyOrNone(`
      SELECT s.ip, q.text AS question, a.text AS answer FROM Session s
      LEFT JOIN SessionAnswer sa ON sa.session_id = s.id
      LEFT JOIN Question q ON q.id = sa.question_id
      LEFT JOIN Answer a ON a.id = sa.answer_id
      WHERE sa.timestamp >= current_date - 1 AND sa.timestamp <= current_date
      ORDER BY s.ip, sa.timestamp;
    `)
      .then(function (data) {
        if (data.length > 0) {
          var rows = [];

          for (i = 0; i < data.length; i++) {
            var answerText = data[i].answer;
            var questionText = data[i].question;

            var answer = new Answer(null, answerText);
            var question = new Question(null, questionText, [answer]);

            var row = {
              ip: data[i].ip,
              question: question
            }

            rows.push(row);
          }

          callback(null, rows);
        } else {
          callback();
        }
      })
      .catch(function (err) {
        callback(err);
      })
  },
};