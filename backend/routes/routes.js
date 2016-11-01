var questionService = require('../services/questionService');
var sessionService = require('../services/sessionService');

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('The app is up and running.')
  });

  // Retrieves a single question with its answers
  app.get('/question/:id', function (req, res) {
    questionService.getQuestion(req.params.id, function (err, data) {
      if (err) {
        console.log(err);
        
        res.status(500).send(`Error: Failed to retrieve a question with id: ${req.params.id}`);
      } else {
        res.json(data.prepareForJSON());
      }
    })
  });

  // Creates a session and returns the id.
  app.get('/create-session', function (req, res) {
    sessionService.createSession(function (err, session) {
      if (err) {
        console.log(err);

        res.status(500).send('Error: Failed to create a session');
      } else {
        res.json(session.id);
      }
    })
  });

  app.get('/delete-session/:id', function (req, res) {
    sessionService.deleteSession(req.params.id, function (err) {
      if (err) {
        console.log(err);

        res.status(500).send(`Error: Failed to delete a session with id ${id}`);
      } else {
        res.sendStatus(200);
      }
    }); 
  })

  /* 
  * Saves the user's current answer.
  * Example request:
  *   {
  *     "session_id":"1",
  *     "question_id":"1",
  *     "answer_id":"1"
  *   }
  */
  app.post('/save-answer', function (req, res) {
    var body = req.body;
    var sessionId = body.session_id;
    var questionId = body.question_id;
    var answerId = body.answer_id;

    if (sessionId == 'undefined' || questionId == 'undefined' || answerId == 'undefined') {
      res.status(500).send('Error: Invalid request parameters')
    } else {
      questionService.saveAnswer(sessionId, questionId, answerId, function (err) {
        if (err) {
          console.log(err);

          res.status(500).send(`Error: Failed to save the answer with session_id ${sessionId}, question_id ${questionId} and answer_id ${answerId}`);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
};