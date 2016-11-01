module.exports = function SessionNotFoundError(sessionId, extra) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name;

  this.message = `Error: Session with id ${id} not found.`;

  this.extra = extra;
};

require('util').inherits(module.exports, Error);