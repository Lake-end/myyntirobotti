var nodemailer = require('nodemailer');

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

module.exports = {
    sendContactMail: function () {
        var mailOptions = {
            from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
            to: 'myyntirobotti@gmail.com',
            subject: 'Yhteydenottopyyntö',
            text: 'Myyntirobotti on vastaanottanut yhteydenottopyynnön.' +

            '\n\nYhteystiedot' +
            '\nEtunimi: x' +
            '\nSukunimi: x' +
            '\nPuh. nro.: x' +
            '\nSähköposti: x' +
            '\nLisätietoa: x' +

            '\n\nAsiakkaan vastaukset' +

            '\n\nMikä on yrityksenne toimiala?' +
            '\nx' +
            '\nMinkä kokoinen yrityksenne on?' +
            '\nx' +
            '\nMiten suuri on yrityksenne liikevaihto?' +
            '\nx' +
            '\nMikä on asemasi yrityksessä?' +
            '\nx' +
            '\nMillainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?' +
            '\nx' +
            '\nKatsoiko asiakas tarjotun videon?' +
            '\nx',

            html: '<p>Myyntirobotti on vastaanottanut yhteydenottopyynnön.</p>' +

            '<p>Yhteystiedot<br>' +
            'Etunimi: x<br>' +
            'Sukunimi: x<br>' +
            'Puh. nro.: x<br>' +
            'Sähköposti: x<br>' +
            'Organisaation nimi: x<br>' +
            'Lisätietoa: x</p>' +

            '<p>Asiakkaan vastaukset</p>' +
            '<p>Mikä on yrityksenne toimiala?<br>' +
            'x<br>' +
            'Minkä kokoinen yrityksenne on?<br>' +
            'x<br>' +
            'Miten suuri on yrityksenne liikevaihto?<br>' +
            'x<br>' +
            'Mikä on asemasi yrityksessä?<br>' +
            'x<br>' +
            'Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?<br>' +
            'x<br>' +
            'Katsoiko asiakas tarjotun videon?<br>' +
            'x</p>'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Contact request sent: ' + info.response);
        });
    },

    sendReportMail: function () {
        var mailOptions = {
            from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
            to: 'myyntirobotti@gmail.com',
            subject: 'Kooste Myyntirobotin käyttöhistoriasta ajalta x',
            text: 'Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta ajalta x - x.' +

                  '\n\nKooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.',
            html: '<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta ajalta x - x.</p>' +

                  '<p>Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>',
            /*
            attachments:
            {
                path: './attachment.csv'
            }
            */
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Usage history report sent: ' + info.response);
        });
    }
}

/*
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
*/