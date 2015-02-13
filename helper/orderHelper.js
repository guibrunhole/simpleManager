(function() {

    'use strict';

    var uuid = require('node-uuid');
    var NodePDF = require('nodepdf');
    var q = require('q');

    module.exports = function() {

        function buildDeliveryHeader(order, church, buyer) {

            return  '<div class="col-xs-12">' +
                        '<div class="col-xs-12">' +
                            '<label>Casa de oração:</label> ' + church.name +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="col-xs-12">' +
                            '<label>Endereço:</label> ' + church.address +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="col-xs-4">' +
                            '<label>Cidade:</label> ' + church.city +
                        '</div>' +
                        '<div class="col-xs-1">' +
                            '<label>UF:</label> ' + church.state +
                        '</div>' +
                        '<div class="col-xs-3">' +
                            '<label>CEP:</label> ' + church.zipcode +
                        '</div>' +
                        '<div class="col-xs-4">' +
                            '<label>CNPJ:</label> ' + church.cnpj +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="col-xs-8">' +
                            '<label>Comprador:</label> ' + buyer.name +
                        '</div>' +
                        '<div class="col-xs-4">' +
                            '<label>Telefone:</label> ' + church.phone_number +
                        '</div>' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="col-xs-12">' +
                            '<label>Observação:</label> ' + order.obs +
                        '</div>' +
                    '</div>';
        }


        function getProductRow(row){
            return  '<tr>' +
                        '<td>' + row.product_id + '</td>' +
                        '<td>' + row.name + '</td>' +
                        '<td>' + row.product_quantity + ' ' + row.product_unity +   '</td>' +
                    '</tr>';
        }

        function getProductTableContents(orderDetais) {

            var contents = '';

            for(var i = 0; i < orderDetais.length; i++) {

                contents = contents + getProductRow(orderDetais[i]);
            }

            return contents;
        }

        function getProductsTable(orderDetails) {

            return '<table class="table table-striped">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Código</th>' +
                                '<th>Descrição</th>' +
                                '<th>Quantidade</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                             getProductTableContents(orderDetails) +
                        '</tbody>' +
                    '</table>';
        }

        function parseToHtml(order, church, buyer, orderDetails) {

            return '<html>' +
                        '<head>' +
                            '<link rel="stylesheet" href="http://localhost:3000/libs/bootstrap/css/bootstrap.css" media="print">' +
                        '</head>' +
                        '<body>' +
                            '<div class="row">' +
                                '<h1 class="text-center">' +
                                    'CONGREGAÇÃO CRISTÃ NO BRASIL' +
                                '</h1>' +
                            '</div>' +
                            '<div class="row">' +
                                '<h2 class="text-center">' +
                                    'Pedido de compra' +
                                '</h2>' +
                            '</div>' +
                            '<hr />' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h4>' +
                                        'Local de entrega' +
                                    '</h4>' +
                                '</div>' +
                                buildDeliveryHeader(order, church, buyer) +
                            '</div>' +
                            '<hr />' +
                            '<div class="row">' +
                                '<div class="col-xs-12">' +
                                    '<h4>' +
                                        'Resumo da compra' +
                                    '</h4>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-12">' +
                                        getProductsTable(orderDetails) +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<hr />' +
                            '<div class="row">' +
                                '<div class="col-xs-5 col-xs-offset-1 text-center">' +
                                    '<p>_________________________________________</p>' +
                                    '<label>Assinatura Responsável</label>' +
                                '</div>' +
                                '<div class="col-xs-5 text-center">' +
                                    '<p>_________________________________________</p>' +
                                    '<label>Assinatura Comissão de Compras</label>' +
                                '</div>' +
                            '</div>' +
                            '</body>' +
                        '</html>';
        }

        return {

            createPdf: function(order, church, buyer, orderDetails) {

                var deferred = q.defer();

                var createdPdfPath = 'temp/' + uuid.v4() + '.pdf';
                var pdf = new NodePDF(null, createdPdfPath, {
                    content: parseToHtml(order, church, buyer, orderDetails),
                    viewportSize: {
                        width: 3000,
                        height: 9000
                    },
                    paperSize: {
                        pageFormat: 'A4',
                        margin: {
                            top: '2cm'
                        },
                        footer: {
                            height: '1cm',
                            contents: '<div style="text-align: right;">{currentPage} / {pages}</div>'
                        }
                    },
                    zoomFactor: 1
                });

                pdf.on('error', function(msg){
                    console.log('Normal error: ' + msg);
                    deferred.reject(msg);
                });

                pdf.on('done', function(pathToFile){
                    console.log('Done \\o/ :' + pathToFile);
                    deferred.resolve(createdPdfPath);
                });

                return deferred.promise;
            }
        };
    };
})();