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

  saveAnswer: function (sessionAnswer, callback) {
    // Check whether the session exists
    sessionDao.getSession(sessionAnswer.session.id, function (err, data) {
      if (err) {
        callback(new SessionNotFoundError(sessionId));
      }
    });

    questionDao.saveAnswer(sessionAnswer, function (err, data) {
      if (err) {
        callback(err);
      } else {
        questionDao.getCurrentQuestion(sessionAnswer.answer.id, function (err, question) {
          sessionDao.updateSession(sessionAnswer.session.id, question.id, function (err, question) {
            callback(err, data);
          })
        })
      }
    });
  }
};