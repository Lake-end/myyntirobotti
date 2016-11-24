var json2csv = require('json2csv');
var nodemailer = require('nodemailer');
var emailListDao = require('../daos/emailListDao');

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
    sendEmailList: function (callback) {
        emailListDao.getEmailList(function (err, rows) {
            if (err) {
                callback(err);
            } else {

                var jsonRows = [];
                for (i = 0; i < rows.length; i++) {
                    var jsonRow = {
                        "organisation": rows[i].organisation.toString(),
                        "email": rows[i].email.toString()
                    };

                    jsonRows.push(jsonRow);
                }

                var fields = ['organisation', 'email'];
                var result = json2csv({data: jsonRows, fields: fields});

                var date = new Date();
                var day = date.getDate() - 1;     // previous day
                var month = date.getMonth() + 1;  // months start from 0
                var year = date.getFullYear();

                var dateStr = `${day}.${month}.${year}`;
                var fileDate = year.toString() + month.toString() + day.toString();

                var mailOptions = {
                    from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
                    to: 'myyntirobotti@gmail.com',
                    subject: 'Kooste Myyntirobotin vastaanottamista sähköpostiosoitteista päivältä ' + dateStr,
                    text: `Myyntirobotti on muodostanut ajastetun koosteen sovelluksen vastaanottamista sähköpostiosoitteista päivältä ${dateStr}.

\n\nKooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
                    html: `<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen vastaanottamista sähköpostiosoitteista päivältä ${dateStr}.</p>

<p>Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
                    attachments: {
                        filename: `emailList_${fileDate}.csv`,
                        content: result,
                    }
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Email list sent: ' + info.response);
                });


                callback();
            }
        });
    }
}