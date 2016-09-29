var db = require ('../database/database');

var Question = require('../models/question');

module.exports = {
  getQuestion: function (id, callback) {
    db.one("SELECT * FROM question WHERE id=$1", id)
      .then(function (data) {
        var question = new Question(data.id, data.question_text);
        callback(null, question);
      })
      .catch(function (error) {
        callback(new Error(error, null));
      });
  }
};