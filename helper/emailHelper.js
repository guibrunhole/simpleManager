(function () {

    'use strict';

    var nodemailer = require('nodemailer');
    var mandrillTransport = require('nodemailer-mandrill-transport');

    module.exports = function() {

        var transport = nodemailer.createTransport(mandrillTransport({
            auth: {
                apiKey: process.env.MANDRILL_KEY
            }
        }));

        return {
            sendDetailedOrder: function(recipientEmail, pdfName, spreadSheetPath) {

                console.log("Sending report!");

                var mailOptions = {
                    from:  'CCB - Sistema de Compras <' + process.env.MANDRILL_USER + '>',
                    to: recipientEmail,
                    subject: 'Relatorio',
                    text: 'Segue em anexo o relatorio do pedido.',
                    attachments: [{
                        filename: pdfName ? pdfName + '.pdf' : 'Pedido.pdf',
                        path: spreadSheetPath
                    }]
                };

                transport.sendMail(mailOptions, function(error, info){

                    if(error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.messageId);
                });
            }
        };
    };
})();