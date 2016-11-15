var Contact = function (id, sessionId, timestamp, name, surname, phone, email, organisation, comments) {
  this.id = id || null;
  this.sessionId = sessionId || null;
  this.timestamp = new Date();
  this.name = name || '';
  this.surname = surname || '';
  this.phone = phone || '';
  this.email = email || '';
  this.organisation = organisation || '';
  this.comments = comments || '';
};

module.exports = Contact;