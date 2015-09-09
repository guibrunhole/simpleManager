(function () {

    'use strict';

    var nodemailer = require('nodemailer');

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
            sendDetailedOrder: function(recipientEmail, pdfName, spreadSheetPath) {

                var mailOptions = {
                    from:  'CCB - Sistema de Compras <' + process.env.MANDRILL_USER + '>',
                    to: recipientEmail,
                    subject: 'Relatorio',
                    text: 'Segue me anexo o relatorio do pedido.',
                    attachments: [{
                        filename: pdfName ? pdfName + '.pdf' : 'Pedido.pdf',
                        path: spreadSheetPath
                    }]
                };

                transporter.sendMail(mailOptions, function(error, info){

                    if(error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.response);
                });
            }
        };
    };
})();