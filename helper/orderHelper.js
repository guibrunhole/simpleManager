(function() {

    'use strict';

    var uuid = require('node-uuid');
    var NodePDF = require('nodepdf');
    var q = require('q');

    module.exports = function() {

        function getProductsTable() {

            return '<table class="table table-striped">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Código</th>' +
                                '<th>Descrição</th>' +
                                '<th>Quantidade</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            '<tr>' +
                                '<td>1</td>' +
                                '<td>Treco</td>' +
                                '<td>1 caixa</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>2</td>' +
                                '<td>Outro treco</td>' +
                                '<td>2 latas</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td>3</td>' +
                                '<td>Mais um treco</td>' +
                                '<td>1 galão</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>';
        }

        function parseToHtml() {

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
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-12">' +
                                        '<label>Casa de oração:</label> Rio acima' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-12">' +
                                        '<label>Endereço:</label> Rua um, 287' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-4">' +
                                        '<label>Cidade:</label> Jundiaí' +
                                    '</div>' +
                                    '<div class="col-xs-1">' +
                                        '<label>UF:</label> SP' +
                                    '</div>' +
                                    '<div class="col-xs-3">' +
                                        '<label>CEP:</label> 13215-802' +
                                    '</div>' +
                                    '<div class="col-xs-4">' +
                                        '<label>CNPJ:</label> 50.981.885/0001-25' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-8">' +
                                        '<label>Comprador:</label> Rode Simione Cunha' +
                                    '</div>' +
                                    '<div class="col-xs-4">' +
                                        '<label>Telefone:</label> (11) 98404-5049' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-xs-12">' +
                                    '<div class="col-xs-12">' +
                                        '<label>Observação:</label> ENTREGAR NO CHAVEIRO CATU - PONTE DE CAMPINAS PERTO DO SESÃO HORARIO COMERCIAL' +
                                    '</div>' +
                                '</div>' +
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
                                        getProductsTable() +
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

            createPdf: function() {

                var deferred = q.defer();

                var createdPdfPath = 'temp/' + uuid.v4() + '.pdf';
                var pdf = new NodePDF(null, createdPdfPath, {
                    content: parseToHtml(),
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
                    deferred.reject();
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