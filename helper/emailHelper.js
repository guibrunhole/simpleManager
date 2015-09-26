(function () {

    'use strict';

    var nodemailer = require('nodemailer');
    var q = require('q');

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

                var deferred = q.defer();

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

                transporter.sendMail(mailOptions, function(error){

                    if(error)
                        deferred.reject(error);
                    else
                        deferred.resolve();
                });

                return deferred.promise;
            }
        };
    };
})();