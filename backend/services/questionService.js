var questionDao = require('../daos/questionDao');
var sessionDao = require('../daos/sessionDao');

module.exports = {
  getQuestion: function (id, callback) {
    questionDao.getQuestion(id, function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  },
  saveAnswer: function (sessionId, questionId, answerId, callback) {
    // Check whether the session exists
    sessionDao.getSession(sessionId, function (err, data) {
      if (err) {
        callback(err);
      }
    });

    questionDao.saveAnswer(sessionId, questionId, answerId, function (err, data) {
      if (err) {
        callback(err);
      } else {
        sessionDao.updateSession(sessionId, questionId);
        callback();
      }
    });
  }
};