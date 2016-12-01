var json2csv = require('json2csv');
var nodemailer = require('nodemailer');
var reportDao = require('../daos/reportDao');
var xl = require('excel4node');
var async = require('async');

// TODO: put these into another file and obtain values from env variables.
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
    // Uses hard coded question IDs due to time constraints.
    // 1 = industry, 2 = size and 3 = revenue
    async.series([
      function (callback) { reportDao.getUserCounts(callback) },
      function (callback) { reportDao.getAnswerCounts(1, callback) },
      function (callback) { reportDao.getAnswerCounts(2, callback) },
      function (callback) { reportDao.getAnswerCounts(3, callback) },
      function (callback) { reportDao.getReportData(callback) }
    ],
    function (err, results) {
      if (err) {
        callback(err);
      } else {
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        var startDateStr = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;

        var endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        var endDateStr = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;

        var wb = new xl.Workbook();

        // TODO: switch ws to ws2
        var ws2 = wb.addWorksheet('Vastaukset');
        var ws = wb.addWorksheet('Kooste');

        var style = wb.createStyle({
          font: {
            color: '#FF0800',
            size: 12
          }
        });

        var h2 = wb.createStyle({
          font: {
            bold: true,
            size: 15
          }
        })

        var columnHeaderStyle = wb.createStyle({
          font: {
            bold:true
          }
        });

        ws.column(1).setWidth(25);
        ws.column(2).setWidth(50);
        ws.column(3).setWidth(15);

        ws.cell(1, 1, 1, 2, true).string(`Kooste ajalta ${startDateStr} - ${endDateStr}`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        var row = 3;

        ws.cell(row, 1).string('Loppuun päässeiden osuus vastanneista').style(h2);
        row += 2;

        ws.cell(row, 1).string('Kesken jääneet');
        var unfinished = parseInt(results[0][1]);
        ws.cell(row, 2).number(unfinished);
        row++;
        ws.cell(row, 1).string('Loppuun päässeet');
        var finished = parseInt(results[0][0]);
        ws.cell(row, 2).number(finished);
        row++;
        ws.cell(row, 1).string('Yhteensä');
        var sum = finished + unfinished
        ws.cell(row, 2).number(sum);

        row += 2;

        ws.cell(row, 1).string('Kooste loppuun päässeiden yritysten tiedoista').style(h2);

        row += 2;

        for (i = 1; i < 4; i++) {
          var header = '';

          switch (i) {
            case (1):
              header = 'Toimiala'
              break;
            case (2):
              header = 'Yrityksen koko'
              break;
            case (3):
              header = 'Liikevaihto'
              break;
          }

          var result = results[i];

          if (typeof result !== 'undefined') {
            ws.cell(row, 1).string(header).style(columnHeaderStyle);

            result.answerCounts.forEach(function (value, key, map) {
              ws.cell(row, 2).string(key.text);
              ws.cell(row, 3).number(value);
              row++;
            })

            row ++;
          }
        }

        ws2.column(1).setWidth(50);
        ws2.column(2).setWidth(50);

        ws2.cell(1, 1, 1, 3, true).string(`Kaikki vastaukset ajalta ${startDateStr} - ${endDateStr}`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        var allAnswers = results[4];
        var row = 3;

        for (i = 0; i < allAnswers.length; i++) {
          ws2.cell(row, 1).string(allAnswers[i].ip).style(columnHeaderStyle);

          var startTime = allAnswers[i].startTime;
          var endTime = allAnswers[i].endTime;

          var startTimeStr = `${startTime.getDate()}/${startTime.getMonth() + 1}/${startTime.getFullYear() - 2000} \
${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`;

          var endTimeStr = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`;
          var dateStr = `${startTimeStr} - ${endTimeStr}`;
          var entry = `#${i + 1} ${dateStr}`;

          ws2.cell(row, 2).string(entry).style(columnHeaderStyle);

          row += 2;

          var answerMap = allAnswers[i].answerMap

          answerMap.forEach(function (value, key, map) {
            ws2.cell(row, 1).string(key);
            ws2.cell(row, 2).string(value);
            row++;
          })

          if (allAnswers[i].contact.email.length > 0) {
            row++;

            ws2.cell(row, 1).string('Nimi')
            ws2.cell(row, 2).string((allAnswers[i].contact.name || '') + ' ' + (allAnswers[i].contact.surname || ''));
            row++;
            ws2.cell(row, 1).string('Sähköposti')
            ws2.cell(row, 2).string(allAnswers[i].contact.email || '');
            row++;
            ws2.cell(row, 1).string('Organisaatio')
            ws2.cell(row, 2).string(allAnswers[i].contact.organisation || '');

            row++;
          }

          row += 2;
        }

        wb.writeToBuffer().then(function (buffer) {
          var fileDate = new Date();
          var year = fileDate.getFullYear();
          var month = fileDate.getMonth() + 1; // months start from 0
          var day = fileDate.getDate();

          var filename = `raportti_${year}${month}${day}.xlsx`;
          var mailOptions = {
            from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
            to: 'myyntirobotti@gmail.com',
            subject: `Kooste Myyntirobotin käyttöhistoriasta ajalta ${startDateStr} - ${endDateStr}`,
            text:
`Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta ajalta ${startDateStr} - ${endDateStr}.

Kooste on xlsx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
          html:
`<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta ajalta ${startDateStr} - ${endDateStr}.</p>

<p>Kooste on xlsx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
            attachments:
            {
              filename: filename,
              content: buffer,
            }
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Usage history report sent: ' + info.response);
          });

          callback();
        })
      }
    });
  },
}