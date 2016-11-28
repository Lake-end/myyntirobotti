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
//   sendReport: function (callback) {
//     reportDao.getReportData(function (err, rows) {
//       if (err) {
//         callback(err);
//       } else if (rows.length > 0) {

//         var jsonRows = [];
//         for (i = 0; i < rows.length; i++) {
//           var jsonRow = {
//             "ip": rows[i].ip.toString(),
//             "question": rows[i].question.text.toString(),
//             "answer": rows[i].question.answers[0].text.toString()
//           };

//           jsonRows.push(jsonRow);
//         }

//         var fields = ['ip', 'question', 'answer'];
//         var result = json2csv({ data: jsonRows, fields: fields });

//         var date = new Date();
//         var day = date.getDate() - 1;     // previous day
//         var month = date.getMonth() + 1;  // months start from 0
//         var year = date.getFullYear();

//         var dateStr = `${day}.${month}.${year}`;
//         var fileDate = year.toString() + month.toString() + day.toString();

//         var mailOptions = {
//           from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
//           to: 'myyntirobotti@gmail.com',
//           subject: 'Kooste Myyntirobotin käyttöhistoriasta päivältä ' + dateStr,
//           text:
// `Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta päivältä ${dateStr}.

// Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
//           html:
// `<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen käyttöhistoriasta päivältä ${dateStr}.</p>

// <p>Kooste on liitteenä csv-muotoisessa tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
//           attachments:
//           {
//                 filename: `report_${fileDate}.csv`,
//                 content: result,
//           }
//         };

//         transporter.sendMail(mailOptions, function(error, info) {
//           if (error) {
//             return console.log(error);
//           }
//           console.log('Usage history report sent: ' + info.response);
//         });


//         callback();
//       } else {
//         callback();
//       }
//     });
//   },

  sendReport: function (callback) {
    // Uses hard coded question IDs due to time constraints.
    // 1 = industry, 2 = size and 3 = revenue
    async.series([
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

        var ws = wb.addWorksheet('Analytiikka');

        var style = wb.createStyle({
          font: {
            color: '#FF0800',
            size: 12
          }
        });

        var columnHeaderStyle = wb.createStyle({
          font: {
            bold:true
          }
        });

        ws.column(1).setWidth(50);

        ws.cell(1, 1, 1, 2, true).string(`Analytiikka ajalta ${startDateStr} - ${endDateStr}`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        var row = 3;

        for (i = 0; i < results.length - 1; i++) {
          var result = results[i];

          ws.cell(row,1).string(result.question.text);
          row += 2;
          ws.cell(row,1).string('Vastaus').style(columnHeaderStyle);
          ws.cell(row,2).string('Lukumäärä').style(columnHeaderStyle);
          row++;

          result.answerCounts.forEach(function (value, key, map) {
            ws.cell(row, 1).string(key.text);
            ws.cell(row, 2).number(value);
            row++;
          })

          row += 2;
        }

        var ws2 = wb.addWorksheet('Vastaukset');

        ws2.column(1).setWidth(25);
        ws2.column(2).setWidth(25);
        ws2.column(3).setWidth(50);
        ws2.column(4).setWidth(50);

        ws2.cell(1, 1, 1, 3, true).string(`Kaikki vastaukset ajalta ${startDateStr} - ${endDateStr}`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        ws2.cell(3,1).string('IP').style(columnHeaderStyle);
        ws2.cell(3,2).string('Aika').style(columnHeaderStyle);
        ws2.cell(3,3).string('Kysymys').style(columnHeaderStyle);
        ws2.cell(3,4).string('Vastaus').style(columnHeaderStyle);

        var allAnswers = results[3];

        var row = 4;

        for (i = 0; i < allAnswers.length; i++) {
          ws2.cell(row, 1).string(allAnswers[i].ip);
          ws2.cell(row, 2).date(allAnswers[i].timestamp).style({numberFormat: 'd/m/yy hh:mm:ss'});
          ws2.cell(row, 3).string(allAnswers[i].question.text);
          ws2.cell(row, 4).string(allAnswers[i].question.answers[0].text);
          row++;
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
  }
}