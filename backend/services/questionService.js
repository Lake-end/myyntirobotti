var questionDao = require('../daos/questionDao');

module.exports = {
  getQuestion: function (id, callback) {
    questionDao.getQuestion(id, function(err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  }
};