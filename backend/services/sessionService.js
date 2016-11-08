var sessionDao = require('../daos/sessionDao');

module.exports = {
  createSession: function (ip, callback) {
    sessionDao.createSession(ip, function (err, session) {
      if (err) {
        callback(err);
      } else {
        callback(null, session);
      }
    })
  },

  getSession: function (id, callback) {
    sessionDao.getSession(id, function (err, session) {
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