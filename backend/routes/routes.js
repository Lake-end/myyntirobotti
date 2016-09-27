var service = require('../services/dummyService')

module.exports = function (app) {

  app.get('/dummy', function (req, res) {
    res.send('Dummy response');
  });
};