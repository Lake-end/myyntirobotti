var Contact = require('../models/contact');
var contactDao = require('../daos/contactDao');
var nodemailer = require('nodemailer');

module.exports = {
    sendContactDetails: function (contact, callback) {
        contactDao.saveContactDetails(contact, function (err, data) {
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
                    x
                    Minkä kokoinen yrityksenne on?
                    x
                    Miten suuri on yrityksenne liikevaihto?
                    x
                    Mikä on asemasi yrityksessä?
                    x
                    Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?
                    x
                    Katsoiko asiakas tarjotun videon?
                    x`,

                    html: `Myyntirobotti on vastaanottanut yhteydenottopyynnön.
                    
                    Yhteystiedot
                    Etunimi: ${contact.name}
                    Sukunimi: ${contact.surname}
                    Puh. nro.: ${contact.phone}
                    Sähköposti: ${contact.email} 
                    Organisaatio: ${contact.organisation}
                    Lisätietoa: ${contact.comments}

                    Asiakkaan vastaukset

                    Mikä on yrityksenne toimiala?
                    x
                    Minkä kokoinen yrityksenne on?
                    x
                    Miten suuri on yrityksenne liikevaihto?
                    x
                    Mikä on asemasi yrityksessä?
                    x
                    Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?
                    x
                    Katsoiko asiakas tarjotun videon?
                    x`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Contact request sent: ' + info.response);
                });
                callback();
            }
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