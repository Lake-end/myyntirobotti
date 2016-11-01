var sessionDao = require('../daos/sessionDao');

module.exports = {
  createSession: function (callback) {
    sessionDao.createSession(function (err, session) {
      if (err) {
        callback(err);
      } else {
        callback(null, session);
      }
    })
  },

  deleteSession: function (id, callback) {
    sessionDao.deleteSession(id, function (err) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  }
};