(function() {

    'use strict';

    var uuid = require('node-uuid');
    var NodePDF = require('nodepdf');
    var q = require('q');

    module.exports = function() {

        function buildDeliveryHeader(order) {

            return  "<div class='col-xs-12'>" +
                        "<div class='col-xs-6'>" +
                            "<label>Casa de oração:</label> " + order.churchName +
                        "</div>" +
                        "<div class='col-xs-6'>" +
                            "<label>Inscrição Municipal:</label> " + order.churchRegistration +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-12'>" +
                        "<div class='col-xs-12'>" +
                            "<label>Endereço:</label> " + order.churchAddress +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-12'>" +
                        "<div class='col-xs-3'>" +
                            "<label>Cidade:</label> " + order.churchCity +
                        "</div>" +
                        "<div class='col-xs-2'>" +
                            "<label>UF:</label> " + order.churchState +
                        "</div>" +
                        "<div class='col-xs-3'>" +
                            "<label>CEP:</label> " + (order.churchZipCode ? order.churchZipCode : 'Não informado') +
                        "</div>" +
                        "<div class='col-xs-4'>" +
                            "<label>CNPJ:</label> " + order.churchCnpj +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-12'>" +
                        "<div class='col-xs-8'>" +
                            "<label>Comprador:</label> " + order.buyerName +
                        "</div>" +
                        "<div class='col-xs-4'>" +
                            "<label>Telefone:</label> " + order.churchPhoneNumber +
                        "</div>" +
                    "</div>" +
                    "<div class='col-xs-12'>" +
                        "<div class='col-xs-12'>" +
                            "<label>Observação:</label> " + order.orderObservation +
                        "</div>" +
                    "</div>";
        }

        var unities = {
            'UN': 'Unidade(s)',
            'GL': 'Gal\u00e3o(\u00f5es)',
            'LT': 'Litro(s)',
            'PCT': 'Pacote(s)',
            'CX': 'Caixa(s)'
        };

        function getProductRow(detail, openOrder){
            return  "<tr>" +
                        (!openOrder ? "<td>" + detail.productId + "</td>" : '') +
                        "<td>" + detail.productName + "</td>" +
                        "<td>" + detail.productQuantity + ' ' + (!openOrder ? unities[detail.productUnity] : detail.productUnity) +   "</td>" +
                        "<td>" + 'R$ ' + detail.productPrice + "</td>" +
                    "</tr>";
        }

        function getProductTableContents(orderDetail, openOrder) {

            var contents = '';

            for(var i = 0; i < orderDetail.length; i++) {

                contents = contents + getProductRow(orderDetail[i], openOrder);
            }

            return contents;
        }

        function getProductsTable(orderDetail, openOrder) {

            return "<table class='table table-striped' style='font-size: 1.2em;'>" +
                        "<thead>" +
                            "<tr>" +
                                (!openOrder ? "<th>Código</th>" : '') +
                                "<th>Descrição</th>" +
                                "<th>Quantidade</th>" +
                                "<th>Valor Unitario</th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>" +
                             getProductTableContents(orderDetail, openOrder) +
                        "</tbody>" +
                    "</table>";
        }

        function parseToHtml(order, openOrder) {

            var parsedHtml = "<html>" +
                "<head>" +
                    "<link rel='stylesheet' href='" + process.env.BASE_API_ADDRESS + "/libs/bootstrap/css/bootstrap.css' media='print'>" +
                "</head>" +
                "<body style='font-size: 1.1em;'>" +
                    "<div class='row'>" +
                        "<h1 class='text-center'>" +
                        "CONGREGAÇÃO CRISTÃ NO BRASIL" +
                        "</h1>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<h2 class='text-center'>" +
                        "Pedido de compra - Nº " + order.orderId +
                        "</h2>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<h4 class='text-center'>" +
                         "Data: "+ order.orderDate +
                        "</h4>" +
                    "</div>" +
                    "<hr />" +
                    "<div class='row'>" +
                        "<div class='col-xs-12'>" +
                            "<h4>" +
                            "Local de entrega" +
                            "</h4>" +
                        "</div>" +
                        buildDeliveryHeader(order) +
                    "</div>" +
                    "<hr />" +
                    "<div class='row'>" +
                        "<div class='col-xs-12'>" +
                            "<h4>" +
                                "Resumo da compra" +
                            "</h4>" +
                        "</div>" +
                        "<div class='col-xs-12'>" +
                            "<div class='col-xs-12'>" +
                                getProductsTable(order.orderDetail, openOrder) +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                    "<hr />" +
                    "<div class='row'>" +
                        "<div class='col-xs-5 col-xs-offset-1 text-center'>" +
                            "<p>_________________________________________</p>" +
                            "<label>Assinatura Responsável</label>" +
                        "</div>" +
                        "<div class='col-xs-5 text-center'>" +
                            "<p>_________________________________________</p>" +
                            "<label>Assinatura Comissão de Compras</label>" +
                        "</div>" +
                    "</div>" +
                "</body>" +
            "</html>";

            return parsedHtml;
        }

        return {

            createPdf: function(order, openOrder) {

                var deferred = q.defer();
                var createdPdfPath = 'temp/' + uuid.v4() + '.pdf';
                var pdf = new NodePDF(null, createdPdfPath, {
                    'content': parseToHtml(order, openOrder),
                    'viewportSize': {
                        'width': 3000,
                        'height': 9000
                    },
                    'paperSize': {
                        'pageFormat': 'A4',
                        'margin': {
                            'top': '2cm'
                        },
                        'footer': {
                            'height': '1cm',
                            'contents': "<div style='text-align: right;'>{currentPage} / {pages}</div>"
                        }
                    },
                    'zoomFactor': 1
                });

                pdf.on('error', function(msg){
                    deferred.reject(msg);
                });

                pdf.on('done', function(pathToFile){
                    deferred.resolve(createdPdfPath);
                });

                pdf.on('stderr', function(stderr){
                    deferred.reject(stderr);
                });

                return deferred.promise;
            }
        };
    };
})();