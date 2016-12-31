(function() {

    'use strict';

    var q = require('q');
    var ORDER_DETAIL_INSERT = 'INSERT INTO order_detail (order_id, product_id, product_quantity, product_unity) ' +
                                'VALUES (?, ?, ?, ?);';

    var GET_ORDER_PDF = 'SELECT ' +
                            'CAST(CAST(o.created_at AS DATE) AS CHAR) AS orderDate, ' +
                            'o.id AS orderId, ' +
                            'o.obs AS orderObservation, ' +
                            'c.address AS churchAddress, ' +
                            'c.state_registration AS churchRegistration, ' +
                            'c.name AS churchName, ' +
                            'c.city AS churchCity, ' +
                            'c.state AS churchState, ' +
                            'c.zipcode AS churchZipCode, ' +
                            'c.cnpj AS churchCnpj, ' +
                            'c.phone_number AS churchPhoneNumber,' +
                            'c.responsible_buyer AS buyerName ' +
                        'FROM orders o ' +
                            'INNER JOIN church c ON c.id = o.church_id ' +
                        'WHERE o.id = ?;';

    var GET_ORDER_DETAILS_PDF = 'select ' +
                                    'p.id_on_supplier as productId, ' +
                                    'p.name as productName, ' +
                                    'od.product_quantity as productQuantity, ' +
                                    'od.product_unity as productUnity, ' +
                                    'p.price as productPrice ' +
                                'from order_detail od ' +
                                    'inner join products p on p.id = od.product_id ' +
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

                var query = 'SELECT o.id,c.name AS church_name,o.created_at,CONCAT(\'R$ \',CAST(CAST(SUM(p.price) AS DECIMAL(10,2)) AS CHAR(20))) AS total ' +
                    'FROM orders o ' +
                    'INNER JOIN church c ON o.church_id = c.id ' +
                    'INNER JOIN order_detail od ON o.id = od.order_id ' +
                    'INNER JOIN products p ON od.product_id = p.id ' +
                    'GROUP BY o.id ,c.name,o.created_at';

                var queryParams = [];

                if(searchParam) {
                    query = query + ' WHERE c.name like ?';
                    queryParams = ['%' + searchParam + '%'];
                }

                query += ' ORDER BY o.id';

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

                                    var productParams = [resultInfo.insertId, product.productId, product.quantity, product.unity];

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

                    connection.query('select o.obs as obs, c.id as church_id, c.name as church_name, o.created_at from orders o ' +
                                        'inner join church c where c.id = o.church_id and o.id = ?',
                                        [orderId], function(queryError, row) {

                        if(queryError) {

                            deferred.reject(queryError);
                        } else {

                            var order = row[0];

                            connection.query('select p.id as productId, p.name, o.product_quantity, o.product_unity from order_detail o ' +
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

                    var params = [];

                    var deleteOrderDetailQuery = 'DELETE FROM order_detail where order_id=?;';
                    params.push(orderId);

                    var orderDetailQuery = '';
                    var orderDetailQueryParams = [orderId];

                    for (var i = 0; i < updatedOrder.orderDetails.length; i++) {
                        var product = updatedOrder.orderDetails[i];
                        orderDetailQuery = orderDetailQuery + ORDER_DETAIL_INSERT;

                        var productParams = [orderId, product.productId, product.product_quantity, product.product_unity];

                        orderDetailQueryParams = orderDetailQueryParams.concat(productParams);
                    }

                    if (updatedOrder.orderDetails.length > 0) {

                        //console.log(orderDetailQueryParams);
                        connection.query(deleteOrderDetailQuery + orderDetailQuery, orderDetailQueryParams, function (queryError, result) {

                            if (queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve(result.insertId);
                        });
                    } else {
                        deferred.resolve(result.insertId);
                    }
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