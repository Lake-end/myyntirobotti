var Contact = require('../models/contact');
var db = require('../database/database');

module.exports = {
  saveContactDetails: function (contact, callback) {
    var sessionId = contact.sessionId;
    var timestamp = contact.timestamp;
    var name = contact.name;
    var surname = contact.surname;
    var phone = contact.phone;
    var email = contact.email;
    var org = contact.organisation;
    var comments = contact.comments;

    db.none('INSERT INTO Contact(session_id, timestamp, name, surname, phone, email, organisation, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [sessionId, new Date(), name, surname, phone, email, org, comments])
      .then(function () {
        callback(null);
      })
      .catch(function (err) {
        callback(err);
      })
  },

  getContactDetails: function (sessionId, callback) {
    db.one('SELECT * FROM Contact WHERE session_id = $1', sessionId)
      .then(function (data) {
        var id = data.id;
        var sessionId = data.sessionId;
        var timestamp = data.timestamp;
        var name = data.name;
        var surname = data.surname;
        var phone = data.phone;
        var email = data.email;
        var org = data.org;
        var comments = data.comments;

        var contact = new Contact(id, sessionId, timestamp, name, surname, phone, email, org, comments);

        callback(null, contact);
      })
      .catch(function (err) {
        callback(err);
      })
  }
}