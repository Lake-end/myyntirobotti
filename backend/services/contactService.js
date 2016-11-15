var Contact = require('../models/contact');
var contactDao = require('../daos/contactDao');

module.exports = {
  sendContactDetails: function (contact, callback) {
    contactDao.saveContactDetails(contact, function(err, data) {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },
  getContactDetails: function (contact, callback) {
    contactDao.getContactDetails(sessionId, function(err, contact) {
      if (err) {
        callback(err);
      } else {
        callback(null, contact);
      }
    })
  }
};