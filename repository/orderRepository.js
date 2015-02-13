(function() {

    'use strict';

    var q = require('q');

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
            getOrderDetails: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    console.log(orderId);
                    connection.query('SELECT order_detail.product_id, products.name, order_detail.product_quantity, order_detail.product_unity ' +
                                        'FROM order_detail ' +
                                        'INNER JOIN products ' +
                                        'ON order_detail.product_id = products.id WHERE order_detail.order_id = ?', [orderId],
                        function(queryError, rows) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve(rows);
                        });
                });
            }
        };
    };
})();