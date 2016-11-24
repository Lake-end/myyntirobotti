var questionService = require('../services/questionService');
var sessionService = require('../services/sessionService');
var emailService = require('../services/emailService');
var contactService = require('../services/contactService');

var Answer = require('../models/answer');
var Contact = require('../models/contact');
var Question = require('../models/question');
var Session = require('../models/session');
var SessionAnswer = require('../models/sessionAnswer');

var SessionNotFoundError = require('../libs/errors/sessionNotFoundError');

var express = require('express');

module.exports = function (app) {
  app.use('/js', express.static(__dirname + '/../../frontend/app/js'));
  app.use('/app', express.static(__dirname + '/../../frontend/app/'));
  app.use('/controllers', express.static(__dirname + '/../../frontend/app/controllers'));
  app.use('/directives', express.static(__dirname + '/../../frontend/app/directives'));
  app.use('/services', express.static(__dirname + '/../../frontend/app/services'));
  app.use('/styles', express.static(__dirname + '/../../frontend/styles'));

  app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + '/../../frontend/views/' });
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
    var ip = req.headers['x-forwarded-for']
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress;

    sessionService.createSession(ip, function (err, session) {
      if (err) {
        console.log(err);

        res.status(500).send('Error: Failed to create a session');
      } else {
        res.json(session.id);
      }
    })
  });

  app.get('/get-session/:id', function (req, res) {
    var id = req.params.id;
    var ip = req.headers['x-forwarded-for']
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress;

    sessionService.getSession(id, ip, function (err, session) {
      if (err) {
        console.log(err);

        if (err instanceof SessionNotFoundError) {
          res.status(500).send(err.message);
        } else {
          res.status(500).send(`Error: Failed to retrieve a session with id ${id}`);
        }

      } else {
        res.json(session.prepareForJSON());
      }
    });
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
  });

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
    var linkClicked = body.link_clicked || false;

    if (sessionId == 'undefined' || questionId == 'undefined' || answerId == 'undefined') {
      res.status(500).send('Error: Invalid request parameters')
    } else {

      var session = new Session(sessionId);
      var answer = new Answer(answerId);
      var question = new Question(questionId);
      var sessionAnswer = new SessionAnswer(null, null, session, question, answer, linkClicked);

      questionService.saveAnswer(sessionAnswer, function (err) {
        if (err) {
          console.log(err);

          if (err instanceof SessionNotFoundError) {
            res.status(500).send(err.message);
          } else {
            res.status(500).send(`Error: Failed to save the answer with session_id ${sessionId}, \
question_id ${questionId} and answer_id ${answerId}`);
          }

        } else {
          res.sendStatus(200);
        }
      });
    }
  });

  app.post('/send-contact-request', function (req, res) {
    var body = req.body;

    var sessionId = body.session_id;
    var name = body.name;
    var surname = body.surname;
    var phone = body.phone;
    var email = body.email;
    var organisation = body.organisation;
    var comments = body.comments;

    var contact = new Contact(null, sessionId, null, name, surname, phone, email, organisation, comments);

    contactService.sendContactDetails(contact, function(err) {
      if (err) {
        console.log(err);

        res.status(500).send('Error: Failed to send contact details');
      } else {
        res.sendStatus(200);
      }
    });
  });
};