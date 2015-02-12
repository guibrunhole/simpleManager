(function() {

    'use strict';

    var q = require('q');
    var uuid = require('node-uuid');
    var NodePDF = require('nodepdf');

    module.exports = function(dbPool) {

        function queryFromPool(queryCallback) {
            var deferred = q.defer();

            dbPool.getConnection(function(connectionError, connection){

                if(connectionError) {

                    deferred.reject();
                } else {
                    queryCallback(deferred, connection);
                    connection.release();
                }
            });

            return deferred.promise;
        }

        return {
            getAll: function() {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM orders', null, function(queryError, rows) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newOrder) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO orders (order_number, product_quantity, church_id, user_id, product_id, unity) ' +
                        'VALUES (?, ?, ?, ?, ?, ?)',
                        [newOrder.order_number, newOrder.product_quantity, newOrder.church_id, newOrder.user_id,
                            newOrder.product_id, newOrder.unity],
                        function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM orders WHERE id = ?', [orderId], function(queryError, row) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(row);
                    });
                });
            },
            update: function(orderId, updatedOrder) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('UPDATE orders SET order_number = ?, product_quantity = ?, church_id = ?, user_id = ?, product_id = ?, unity = ? WHERE id = ?',
                        [updatedOrder.order_number, updatedOrder.product_quantity, updatedOrder.church_id, updatedOrder.user_id,
                            updatedOrder.product_id, updatedOrder.unity, orderId],
                        function(queryError) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve();
                        });
                });
            },
            produceDetailedOrder: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    var createdPdfPath = 'temp/' + uuid.v4() + '.pdf';
                    var pdf = new NodePDF(null, createdPdfPath, {
                        content: '<html><body><p style="color: red">SUP!</p></body></html>',
                        viewportSize: {
                            width: 3000,
                            height: 9000
                        },
                        paperSize: {
                            pageFormat: 'A4',
                            margin: {
                                top: '2cm'
                            },
                            header: {
                                height: '1cm',
                                contents: 'HEADER {currentPage} / {pages}'
                            },
                            footer: {
                                height: '1cm',
                                contents: 'FOOTER {currentPage} / {pages}'
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
                });
            }
        };
    };
})();