var sessionDao = require('../daos/sessionDao');

module.exports = {
  createSession: function (ip, callback) {
    sessionDao.createSession(null, ip, function (err, session) {
      if (err) {
        callback(err);
      } else {
        callback(null, session);
      }
    })
  },

  getSession: function (id, ip, callback) {
    sessionDao.getSession(id, function (err, session) {
      if (err) {
        sessionDao.createSession(id, ip, function (err, session) {
          if (err) {
            callback(err)
          } else {
            callback(null, session)
          }
        })
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