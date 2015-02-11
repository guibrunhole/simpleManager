(function() {

    'use strict';

    var q = require('q');
    var XLSX = require('xlsx');
    var uuid = require('node-uuid');

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
            getSpreadSheet: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    var sheet = {};
                    var cell_ref = XLSX.utils.encode_cell({c:0,r:0});

                    sheet[cell_ref] = {
                        t: 's',
                        v: 'CONGREGAÇÃO CRISTÃ NO BRASIL'
                    };

                    sheet['!ref'] = XLSX.utils.encode_range({s:{c:0, r:0}, e:{c:0, r:0}});
                    sheet['!merges'] = [{s:{c:0, r:0}, e:{c:5, r:0}}];

                    var workbook = {
                        SheetNames: ['test'],
                        Sheets: {
                            test: sheet
                        }
                    };

                    var spreadSheetPath = './temp/' + uuid.v4() + '.xlsx';
                    XLSX.writeFile(workbook, spreadSheetPath);

                    deferred.resolve(spreadSheetPath);
                });
            }
        };
    };
})();