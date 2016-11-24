var Contact = require('../models/contact');
var contactDao = require('../daos/contactDao');
var sessionDao = require('../daos/sessionDao');
var nodemailer = require('nodemailer');

module.exports = {
    sendContactDetails: function (contact, callback) {

        contactDao.saveContactDetails(contact, function (err, data) {

            sessionDao.getSessionAnswers(contact.sessionId, function (err, answers) {

                if (err) {
                    callback(err);
                } else {
                    var smtpConfig = {
                        host: 'smtp.gmail.com',
                        secureConnection: false,
                        port: 587,
                        domains: ['gmail.com', 'googlemail.com'],
                        auth: {
                            user: 'myyntirobotti@gmail.com',
                            pass: 'myyntirobottisalasana3'
                        }
                    };

                    var transporter = nodemailer.createTransport(smtpConfig);

                    var answerStringText = "";
                    var answerStringHtml = "";

                    for (i = 0; i < answers.length; i++) {
                        if (answers[i].question.id > 0 && answers[i].question.id < 6) {
                            answerStringText = answerStringText.concat(answers[i].question.text + "\n" + answers[i].answer.text + "\n");
                            answerStringHtml = answerStringHtml.concat(answers[i].question.text + "<br>" + answers[i].answer.text + "<br>");
                        }
                    }

                    var linkClicked = "";

                    for (i = 0; i < answers.length; i++) {
                        if (answers[i].question.id == 6) {
                            if (answers[i].linkClicked == true) {
                                linkClicked = "Kyllä";
                            } else {
                                linkClicked = "Ei";
                            }
                            answerStringText = answerStringText.concat("Klikkasiko asiakas linkkiä?\n" + linkClicked);
                            answerStringHtml = answerStringHtml.concat("Klikkasiko asiakas linkkiä?<br>" + linkClicked);
                        }
                    }

                    var mailOptions = {

                        from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
                        to: 'myyntirobotti@gmail.com',
                        subject: 'Yhteydenottopyyntö',
                        text: `Myyntirobotti on vastaanottanut yhteydenottopyynnön.
                    
Yhteystiedot
Etunimi: ${contact.name}
Sukunimi: ${contact.surname}
Puh. nro.: ${contact.phone}
Sähköposti: ${contact.email} 
Organisaatio: ${contact.organisation}
Lisätietoa: ${contact.comments}

Asiakkaan vastaukset

${answerStringText}`,

                        html: `<p>Myyntirobotti on vastaanottanut yhteydenottopyynnön.</p>
                    
                    <p>Yhteystiedot<br>
                    Etunimi: ${contact.name}<br>
                    Sukunimi: ${contact.surname}<br>
                    Puh. nro.: ${contact.phone}<br>
                    Sähköposti: ${contact.email}<br> 
                    Organisaatio: ${contact.organisation}<br>
                    Lisätietoa: ${contact.comments}</p>

                   <p>Asiakkaan vastaukset</p>

                    <p>${answerStringHtml}</p>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Contact request sent: ' + info.response);
                    });
                    callback();
                }
            });
        })
    },
    getContactDetails: function (contact, callback) {
        contactDao.getContactDetails(sessionId, function (err, contact) {
            if (err) {
                callback(err);
            } else {
                callback(null, contact);
            }
        })
    }
};