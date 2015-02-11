(function () {

    'use strict';

    var nodemailer = require('nodemailer');
    var fs = require('fs');
    var uuid = require('node-uuid');

    module.exports = function() {

        var transporter = nodemailer.createTransport({
            host: 'smtp.mandrillapp.com',
            port: 587,
            auth: {
                user: process.env.MANDRILL_USER,
                pass: process.env.MANDRILL_KEY
            }
        });

        return {
            sendSpreadSheet: function(recipientEmail, spreadSheet) {

                var spreadSheetPath = './temp/' + uuid.v4() + '.xlsx';
                fs.writeFileSync(spreadSheetPath, spreadSheet, 'binary');

                var mailOptions = {
                    from:  'CCB - Sistema de Compras <' + process.env.MANDRILL_USER + '>',
                    to: recipientEmail,
                    subject: 'Testing!',
                    text: 'An awesome test \\o/',
                    attachments: [{
                        filename: 'Pedido.xlsx',
                        path: spreadSheetPath
                    }]
                };

                transporter.sendMail(mailOptions, function(error, info){

                    if(error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.response);

                    fs.unlinkSync(spreadSheetPath);
                });
            }
        };
    };
})();