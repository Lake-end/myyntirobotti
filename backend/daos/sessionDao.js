var db = require ('../database/database');

var Session = require('../models/session');
var Question = require('../models/question');

module.exports = {
  createSession: function (callback) {
    db.none("INSERT INTO Session DEFAULT VALUES")
      .then(function (id) {
        var session = new Session();
        callback(null, session);
      })
      .catch(function (err) {
        callback(err);
      })
  },

  getSession: function (id, callback) {
    db.one("SELECT * FROM Session WHERE id = $1", id)
      .then(function (data) {
        var question = new Question(data.current_question, null, null);
        var session = new Session(data.id, question);

        callback(null, session);
      })
      .catch(function (err) {
        callback(err);
      })
  },

  updateSession: function (id, currentQuestion, callback) {
    db.none("UPDATE Session SET current_question = $1 WHERE id = $2", currentQuestion, id)
      .then(function (data) {
        callback();
      })
      .catch(function (err) {
        callback(err);
      })
  },

  deleteSession: function (id, callback) {
    db.tx(function (t) {
      return t.none("UPDATE SessionAnswer SET session_id=null WHERE session_id=$1", id)
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
  }
};