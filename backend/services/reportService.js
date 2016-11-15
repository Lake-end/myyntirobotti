var json2csv = require('json2csv');
var nodemailer = require('nodemailer');
var reportDao = require('../daos/reportDao');

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
  sendReport: function (callback) {
    reportDao.getReportData(function (err, rows) {
      if (err) {
        callback(err);
      } else {

        var jsonRows = [];
        for (i = 0; i < rows.length; i++) {
          var jsonRow = {
            "ip": rows[i].ip.toString(),
            "question": rows[i].question.text.toString(),
            "answer": rows[i].question.answers[0].text.toString()
          };

          jsonRows.push(jsonRow);
        }

        var fields = ['ip', 'question', 'answer'];
        var result = json2csv({ data: jsonRows, fields: fields });

        var date = new Date();
        var day = date.getDate() - 1;     // previous day
        var month = date.getMonth() + 1;  // months start from 0
        var year = date.getFullYear();

        var dateStr = `${day}.${month}.${year}`;
        var fileDate = year.toString() + month.toString() + day.toString();

        var mailOptions = {
          from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
          to: 'myyntirobotti@gmail.com',
          subject: 'Kooste Myyntirobotin käyttöhistoriasta päivältä ' + dateStr,
          text:
`Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta päivältä ${dateStr}.

Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
          html:
`<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta päivältä ${dateStr}.</p> +

<p>Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
          attachments:
          {
                filename: `report_${fileDate}.csv`,
                content: result,
          }
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            return console.log(error);
          }
          console.log('Usage history report sent: ' + info.response);
        });


        callback();
      }
    });
  }
}