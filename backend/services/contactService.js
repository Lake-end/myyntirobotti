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

                    var linkClicked = "";

                    if (answers[5].linkClicked == true) {
                        linkClicked = "Kyllä";
                    } else {
                        linkClicked = "Ei";
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

Mikä on yrityksenne toimiala?
${answers[0].answer.text}
Minkä kokoinen yrityksenne on?
${answers[1].answer.text}
Miten suuri on yrityksenne liikevaihto?
${answers[2].answer.text}
Mikä on asemasi yrityksessä?
${answers[3].answer.text}
Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?
${answers[4].answer.text}
Katsoiko asiakas tarjotun videon?
${linkClicked}`,

                       html: `<p>Myyntirobotti on vastaanottanut yhteydenottopyynnön.</p>
                    
                    <p>Yhteystiedot<br>
                    Etunimi: ${contact.name}<br>
                    Sukunimi: ${contact.surname}<br>
                    Puh. nro.: ${contact.phone}<br>
                    Sähköposti: ${contact.email}<br> 
                    Organisaatio: ${contact.organisation}<br>
                    Lisätietoa: ${contact.comments}</p>

                   <p>Asiakkaan vastaukset</p>

                    <p>Mikä on yrityksenne toimiala?<br>
                    ${answers[0].answer.text}<br>
                    Minkä kokoinen yrityksenne on?<br>
                    ${answers[1].answer.text}<br>
                    Miten suuri on yrityksenne liikevaihto?<br>
                    ${answers[2].answer.text}<br>
                    Mikä on asemasi yrityksessä?<br>
                    ${answers[3].answer.text}<br>
                    Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?<br>
                    ${answers[4].answer.text}<br>
                    Katsoiko asiakas tarjotun videon?<br>
                    ${linkClicked}</p>`
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