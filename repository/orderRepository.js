(function() {

    'use strict';

    var q = require('q');
    var ORDER_DETAIL_INSERT = 'INSERT INTO order_detail (order_id, product_id, product_quantity, product_unity) VALUES (?, ?, ?, ?);';

    module.exports = function(dbPool) {

        function queryFromPool(queryCallback) {
            var deferred = q.defer();

            dbPool.getConnection(function(connectionError, connection){

                if(connectionError) {

                    deferred.reject(connectionError);
                } else {
                    queryCallback(deferred, connection);
                    connection.release();
                }
            });

            return deferred.promise;
        }

        return {
            getAll: function(searchParam) {

                var query = 'SELECT o.id, c.name AS church_name, o.created_at FROM orders o ' +
                    'INNER JOIN church c ON o.church_id = c.id';

                var queryParams = [];

                if(searchParam) {
                    query = query + ' WHERE c.name like ?';
                    queryParams = ['%' + searchParam + '%'];
                }

                return queryFromPool(function(deferred, connection) {

                    connection.query(query, queryParams, function(queryError, rows) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newOrder) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO orders (church_id, user_id, obs, created_at) VALUES (?, ?, ?, ?);',
                        [newOrder.churchId, 1, newOrder.obs || null, new Date()],
                        function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject(queryError);
                            else {

                                var orderDetailQuery = '';
                                var orderDetailQueryParams = [];

                                for(var i = 0; i < newOrder.products.length; i++) {
                                    var product = newOrder.products[i];
                                    orderDetailQuery = orderDetailQuery + ORDER_DETAIL_INSERT;

                                    var productParams = [resultInfo.insertId, product.id, product.quantity, product.unity];

                                    orderDetailQueryParams = orderDetailQueryParams.concat(productParams);
                                }

                                if(newOrder.products.length > 0) {

                                    connection.query(orderDetailQuery, orderDetailQueryParams, function(queryError, result) {

                                        if(queryError)
                                            deferred.reject(queryError);
                                        else
                                            deferred.resolve(resultInfo.insertId);
                                    });
                                } else {
                                    deferred.resolve(resultInfo.insertId);
                                }
                            }

                        });
                });
            },
            getById: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('select c.id as church_id, c.name as church_name, o.created_at from orders o ' +
                                        'inner join church c where c.id = o.church_id and o.id = ?',
                                        [orderId], function(queryError, row) {

                        if(queryError) {

                            deferred.reject(queryError);
                        } else {

                            var order = row[0];

                            connection.query('select p.id, p.name, o.product_quantity, o.product_unity from order_detail o ' +
                                                'INNER JOIN products p where p.id = o.product_id and o.order_id = ?',
                                                [orderId], function(innerQueryError, results) {

                                if(innerQueryError) {

                                    deferred.reject(innerQueryError);
                                } else {

                                    order.orderDetails = results;
                                    deferred.resolve(order);
                                }
                            });
                        }
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
            },
            removeById: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM order_detail where order_id = ?; DELETE FROM orders WHERE id = ?;', [orderId, orderId], function(queryError) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve();
                    });
                });
            }
        };
    };
})();