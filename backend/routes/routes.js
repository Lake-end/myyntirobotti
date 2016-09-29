var questionService = require('../services/questionService');

module.exports = function (app) {

  app.get('/dummy', function (req, res) {
    res.send('Dummy response');
  });

  app.get('/question/:id', function (req, res) {
    questionService.getQuestion(req.params.id, function (err, data) {
      if (err) {
        res.status(500).send(`Failed to retrieve a question with id: ${req.params.id}`);
      } else {
        res.send(data);
      }
    })
  });
};