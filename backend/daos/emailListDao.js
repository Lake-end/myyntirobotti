var db = require('../database/database');

var Contact = require('../models/contact');

module.exports = {
    getEmailList: function (callback) {
        db.manyOrNone(`
      SELECT * FROM 
        (SELECT DISTINCT ON (email) organisation, email, timestamp
        FROM Contact
        WHERE timestamp >= current_date - 1
        ) AS email_list
      ORDER BY timestamp, organisation
    `)
            .then(function (data) {
                if (data.length > 0) {
                    var rows = [];

                    for (i = 0; i < data.length; i++) {
                        var organisation = data[i].organisation;
                        var email = data[i].email;

                        var row = {
                            organisation: organisation,
                            email: email
                        };

                        rows.push(row);
                    }

                    callback(null, rows);
                } else {
                    callback();
                }
            })
            .catch(function (err) {
                callback(err);
            })
    }
};