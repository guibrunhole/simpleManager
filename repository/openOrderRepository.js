(function() {

    'use strict';

    var q = require('q');

    var ORDER_DETAIL_INSERT = 'INSERT INTO open_order_details (order_id, product_quantity, product_name, product_price, product_unity) ' +
        'VALUES (?, ?, ?, ?, ?);';

    var GET_ORDER_PDF = 'SELECT ' +
                            'CAST(CAST(o.created_at AS DATE) AS CHAR) AS orderDate, ' +
                            'o.id AS orderId, ' +
                            'o.obs AS orderObservation, ' +
                            'c.address AS churchAddress, ' +
                            'c.name AS churchName, ' +
                            'c.city AS churchCity, ' +
                            'c.state AS churchState, ' +
                            'c.zipcode AS churchZipCode, ' +
                            'c.cnpj AS churchCnpj, ' +
                            'c.phone_number AS churchPhoneNumber, ' +
                            'c.responsible_buyer AS buyerName ' +
                        'FROM open_orders o ' +
                            'INNER JOIN church c ON c.id = o.church_id ' +
                        'WHERE o.id = ?;';

    var GET_ORDER_DETAILS_PDF = 'select ' +
                                    'od.product_name as productName, ' +
                                    'od.product_quantity as productQuantity, ' +
                                    'od.product_unity as productUnity, ' +
                                    'od.product_price as productPrice ' +
                                'from open_order_details od ' +
                                'where od.order_id = ?;';

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

                var query = 'SELECT o.id, c.name AS church_name, o.created_at FROM open_orders o ' +
                    'INNER JOIN church c ON o.church_id = c.id';

                var queryParams = [];

                if(searchParam) {
                    query = query + ' WHERE c.name like ?';
                    queryParams = ['%' + searchParam + '%'];
                }

                return queryFromPool(function(deferred, connection) {

                    connection.query(query, queryParams, function(queryError, rows) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newOrder) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO open_orders (church_id, user_id, obs, created_at) VALUES (?, ?, ?, ?);',
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

                                    var productParams = [resultInfo.insertId, product.quantity, product.name, product.price, product.unity];

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

                    connection.query('select o.obs as obs, c.id as church_id, c.name as church_name, o.created_at ' +
                        'from open_orders o inner join church c where c.id = o.church_id and o.id = ?;',
                        [orderId], function(queryError, row) {

                            if(queryError) {

                                deferred.reject(queryError);
                            } else {

                                var order = row[0];

                                connection.query('select product_name as name, product_quantity as quantity, ' +
                                    'product_price as price, product_unity as unity from open_order_details ' +
                                    'where order_id = ?;',
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
            removeById: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM open_order_details where order_id = ?; DELETE FROM open_orders WHERE id = ?;', [orderId, orderId], function(queryError) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve();
                    });
                });
            },
            getForPdf: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query(GET_ORDER_PDF, [orderId],
                        function(queryError, result) {

                            if(queryError) {

                                deferred.reject(queryError);
                            } else{

                                var order = result[0];

                                if(!order)
                                    deferred.reject('Order not found!');

                                connection.query(GET_ORDER_DETAILS_PDF, [orderId],
                                    function(queryError, result) {

                                        if(queryError) {

                                            deferred.reject(queryError);
                                        }
                                        else {

                                            order.orderDetail = result;
                                            deferred.resolve(order);
                                        }
                                    });
                            }
                        });
                });
            }
        };
    };
})();
