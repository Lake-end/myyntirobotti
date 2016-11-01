var questionDao = require('../daos/questionDao');
var sessionDao = require('../daos/sessionDao');
var SessionNotFoundError = require('../libs/errors/sessionNotFoundError');

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
        callback(new SessionNotFoundError(sessionId));
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