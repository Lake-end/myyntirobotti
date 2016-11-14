var assert = require('assert');
var should = require('should');
var request = require('supertest');
var pgp = require('pg-promise')();

require('dotenv').load();

process.env.NODE_ENV = 'test';
var db = require('../database/database');

describe('Routing', function() {
  var url = 'http://localhost:3000';

  before(function() {

    return db.none(`
      TRUNCATE SessionAnswer, Session, QuestionAnswer, Question, Answer RESTART IDENTITY
    `)
      .then(function() {
        return db.none(`
          INSERT INTO Question(text) VALUES
            ('First question'),
            ('Second question');
          INSERT INTO Answer(text) VALUES
            ('First answer'),
            ('Second answer');
          INSERT INTO QuestionAnswer(question_id, answer_id, next_question) VALUES
            (1, 1, 2),
            (1, 2, 2),
            (2, 1, 2),
            (2, 2, 2);
        `);
      })
      .catch(function(err) {
        console.log(err);
      });
  })

  describe('Question', function() {
    it('should return first question with its answers', function(done) {
      request(url)
        .get('/question/1')
        .set('Accept', 'application/json')
        .expect(function(res) {
          res.body.id.should.be.exactly('1');
          res.body.answers.length.should.equal(2);
        })
        .expect(200, done);
    });

    it('should throw an error when the question does not exist', function(done) {
      request(url)
        .get('/question/100')
        .set('Accept', 'application/json')
        .expect(500, done);
    })
  })

  describe('Session', function() {

    var sessionId;

    it('should create a session, save an answer using the session and finally delete the session', function(done) {
      var agent = request(url);
      agent
        .get('/create-session')
        .expect(function(res) {
          sessionId = res.body.id;
        })
        .end(function(res) {
          var sessionAnswer  = {
            session_id: sessionId,
            question_id: 1,
            answer_id: 1
          };

          agent.post('/save-answer')
          .send(sessionAnswer)
          .end(function() {
            db.one('SELECT * FROM SessionAnswer WHERE session_id = $1 AND question_id = 1 AND answer_id = 1', sessionId)
              .then(function() {
                agent.get('/delete-session/' + sessionId)
                .end(function(err, res) {
                  db.any('SELECT * FROM SessionAnswer WHERE session_id = $1 AND question_id = 1 AND answer_id = 1', sessionId)
                    .then(function(data) {
                      if (data.length > 0) {
                        throw new Error('Did not delete session with id: ' + sessionId);
                      }
                      done();
                    })
                    .catch(function(err) {
                      done(err);
                    })
                })
              })
              .catch(function(err) {
                done(err);
              })
          })
        })
    });
  })
})