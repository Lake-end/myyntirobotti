var json2csv = require('json2csv');
var nodemailer = require('nodemailer');
var emailListDao = require('../daos/emailListDao');
var xl = require('excel4node');

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
  sendEmailList: function (callback) {
    emailListDao.getEmailList(function (err, rows) {
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

        var ws = wb.addWorksheet('Sähköpostiosoitteet');

        var style = wb.createStyle({
          font: {
            color: '#FF0800',
            size: 12
          }
        });

        var columnHeaderStyle = wb.createStyle({
          font: {
            bold: true
          }
        });

        ws.column(1).setWidth(50);
        ws.column(2).setWidth(50);

        ws.cell(1, 1, 1, 2, true).string(`Kaikki sähköpostiosoitteet ajalta ${startDateStr} - ${endDateStr}`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        ws.cell(3, 1).string('Organisaatio').style(columnHeaderStyle);
        ws.cell(3, 2).string('Sähköpostiosoite').style(columnHeaderStyle);

        var row = 4;

        for (i = 0; i < rows.length; i++) {
          ws.cell(row, 1).string(rows[i].organisation);
          ws.cell(row, 2).string(rows[i].email);
          row++;
        }

        wb.writeToBuffer().then(function (buffer) {
          var fileDate = new Date();
          var year = fileDate.getFullYear();
          var month = fileDate.getMonth() + 1; // months start from 0
          var day = fileDate.getDate();

          var filename = `sahkopostilista_${year}${month}${day}.xlsx`;
          var mailOptions = {
            from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
            to: 'myyntirobotti@gmail.com',
            subject: `Kooste Myyntirobotin vastaanottamista sähköpostiosoitteista ajalta ${startDateStr} - ${endDateStr}`,
            text: `Myyntirobotti on muodostanut ajastetun koosteen sovelluksen vastaanottamista sähköpostiosoitteista ajalta ${startDateStr} - ${endDateStr}.

\n\nKooste on liitteenä xlsx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
            html: `<p>Myyntirobotti on muodostanut ajastetun koosteen sovelluksen vastaanottamista sähköpostiosoitteista ajalta ${startDateStr} - ${endDateStr}.</p>

<p>Kooste on liitteenä xslx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
            attachments: {
              filename: filename,
              content: buffer
            }
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Email list sent: ' + info.response);
          });

          callback();
        })
      }
    });
  },

  sendEmailListAll: function (callback) {
    emailListDao.getEmailListAll(function (err, rows) {
      if (err) {
        callback(err);
      } else {
        var wb = new xl.Workbook();

        var ws = wb.addWorksheet('Sähköpostiosoitteet');

        var style = wb.createStyle({
          font: {
            color: '#FF0800',
            size: 12
          }
        });

        var columnHeaderStyle = wb.createStyle({
          font: {
            bold: true
          }
        });

        ws.column(1).setWidth(20);
        ws.column(2).setWidth(25);
        ws.column(3).setWidth(50);

        ws.cell(1, 1, 1, 3, true).string(`Kaikki tallennetut sähköpostiosoitteet`).style(
          wb.createStyle({
            font: {
              bold: true,
              size: 20
            }
          })
        );

        ws.cell(3, 1).string('Päivämäärä').style(columnHeaderStyle);
        ws.cell(3, 2).string('Organisaatio').style(columnHeaderStyle);
        ws.cell(3, 3).string('Sähköpostiosoite').style(columnHeaderStyle);

        var row = 4;

        for (i = 0; i < rows.length; i++) {
          ws.cell(row, 1).date(rows[i].timestamp).style({numberFormat: 'd/m/yy hh:mm:ss'});
          ws.cell(row, 2).string(rows[i].organisation);
          ws.cell(row, 3).string(rows[i].email);
          row++;
        }

        wb.writeToBuffer().then(function (buffer) {
          var fileDate = new Date();
          var year = fileDate.getFullYear();
          var month = fileDate.getMonth() + 1; // months start from 0
          var day = fileDate.getDate();

          var filename = `sahkopostilistakaikki_${year}${month}${day}.xlsx`;
          var mailOptions = {
            from: '"Myyntirobotti" <myyntirobotti@gmail.com>',
            to: 'myyntirobotti@gmail.com',
            subject: `Kooste kaikista Myyntirobotin vastaanottamista sähköpostiosoitteista`,
            text: `Myyntirobotti on muodostanut koosteen kaikista sovelluksen vastaanottamista sähköpostiosoitteista.

\n\nKooste on liitteenä xlsx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.`,
            html: `<p>Myyntirobotti on muodostanut koosteen kaikista sovelluksen vastaanottamista sähköpostiosoitteista.</p>

<p>Kooste on liitteenä xslx-tiedostossa, jonka voi avata esim. Microsoft Excelillä.</p>`,
            attachments: {
              filename: filename,
              content: buffer
            }
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
            console.log('Email list sent: ' + info.response);
          });

          callback();
        })
      }
    });
  }
}