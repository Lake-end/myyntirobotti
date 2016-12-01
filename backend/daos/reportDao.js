var db = require ('../database/database');

var Session = require('../models/session');
var Question = require('../models/question');
var Answer = require('../models/answer');
var Contact = require('../models/contact');

var ReportRow = require('../models/analytics/reportRow');
var AnalyticsEntry = require('../models/analytics/analyticsEntry');

module.exports = {
  getReportData: function (callback) {
    db.manyOrNone(`
      SELECT DISTINCT ON (s.id, q.id) s.id, s.ip, q.text AS question, a.text AS answer, sa.timestamp as timestamp,
        c.name as name, c.surname as surname, c.phone as phone, c.email as email, c.organisation as org
        FROM Session s
      LEFT JOIN SessionAnswer sa ON sa.session_id = s.id
      LEFT JOIN Question q ON q.id = sa.question_id
      LEFT JOIN Answer a ON a.id = sa.answer_id
      LEFT JOIN Contact c ON c.session_id = s.id
      WHERE sa.timestamp BETWEEN current_date - 7 AND current_date - 1
      ORDER BY s.id, q.id, s.ip, sa.timestamp DESC;
    `)
      .then(function (data) {
        if (data.length > 0) {
          var rows = [];

          var lastId = data[0].id || 0;
          var answerMap = new Map();
          var row = null;

          for (i = 0; i < data.length; i++) {
            var id = data[i].id || 0;

            if (id !== lastId) {
              rows.push(row);
            }

            var answerMap;

            if (i == 0 || id !== lastId) {
              answerMap = new Map();
            } else {
              answerMap = row.answerMap;
            }

            var answerText = data[i].answer;
            var questionText = data[i].question;

            var answers = [];
            if (typeof answerMap !== 'undefined') {
              if (typeof answerMap.get(questionText) !== 'undefined') {
                answers = answerMap.get(questionText);
              }
            }

            answers.push(answerText)

            answerMap.set(questionText, answers);

            var contact = new Contact(null, null, null, data[i].name,
              data[i].surname, data[i].phone, data[i].email, data[i].org);

            if (row === null || row.userId !== id) {
              row = new ReportRow(id, data[i].ip, data[i].timestamp, data[i].timestamp, answerMap, contact);
            } else {
              row.id = id;
              row.ip = data[i].ip;
              row.endTime = data[i].timestamp;
              row.answerMap = answerMap;
            }

            if (i === data.length - 1) {
              rows.push(row);
            }

            lastId = id;
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

  getAnswerCounts: function (questionId, callback) {
    db.manyOrNone(`
      SELECT DISTINCT ON (sa.session_id) a.text as answer, q.text as question FROM Answer a
      LEFT JOIN SessionAnswer sa ON sa.answer_id = a.id
      LEFT JOIN question q ON q.id = sa.question_id
      LEFT JOIN Session s ON s.id = sa.session_id
      WHERE q.id=$1
        AND s.current_question = 1000
        AND sa.timestamp BETWEEN current_date - 7 AND current_date - 1
      ORDER BY sa.session_id, sa.timestamp DESC;
    `, questionId)
      .then(function (data) {
        if (data.length > 0) {
          var question = new Question(null, data[0].question);

          var temp = {};

          for (i = 0; i < data.length; i++) {
            var answer = data[i].answer;
            temp[answer] = temp[answer] ? (temp[answer] + 1) : 1;
          }

          var counts = new Map();

          for (entry in temp) {
            var answer = new Answer(null, entry);
            counts.set(answer, temp[entry]);
          }

          var analyticsEntry = new AnalyticsEntry(question, counts);

          callback(null, analyticsEntry);
        } else {
          callback();
        }
      })
      .catch(function (err){
        callback(err);
      })
  },

  // Retrieves the amount of finished and unfinished users for the dialog.
  getUserCounts: function (callback) {
    db.task(function (t) {
      var q1 = db.oneOrNone(`
        SELECT COUNT(s.id) as finished FROM Session s
        LEFT JOIN SessionAnswer sa ON sa.session_id = s.id
        WHERE current_question = 1000 AND sa.timestamp BETWEEN current_date - 7 AND current_date - 1`);
      var q2 = db.oneOrNone(`SELECT COUNT(s.id) as unfinished FROM Session s
        LEFT JOIN SessionAnswer sa ON sa.session_id = s.id
        WHERE current_question != 1000 AND sa.timestamp BETWEEN current_date - 7 AND current_date - 1`);

      return t.batch([q1, q2]);
    })
      .then(function (data) {
        callback(null, [data[0].finished, data[1].unfinished]);
      })
      .catch(function (err) {
        callback(err);
      })
  }
};