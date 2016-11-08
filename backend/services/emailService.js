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
            text: 'Testi',
            html: 'Testi'
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
            text: 'Testi',
            html: 'Testi'
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