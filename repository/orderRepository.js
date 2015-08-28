(function() {

    'use strict';

    var q = require('q');
    var ORDER_DETAIL_INSERT = 'INSERT INTO order_detail (order_id, product_id, product_quantity, product_unity) VALUES (?, ?, ?, ?);';
    var GET_ORDER_PDF = 'select '+
                            'o.obs as orderObservation, '+
                            'c.address as churchAddress, '+
                            'c.name as churchName, '+
                            'c.city as churchCity, '+
                            'c.state as churchState, '+
                            'c.zipcode as churchZipCode, '+
                            'c.cnpj as churchCnpj, '+
                            'c.phone_number as churchPhoneNumber, '+
                            'u.name as buyerName '+
                        'from orders o '+
                            'inner join church c on c.id = o.church_id '+
                            'inner join user u on u.id = o.user_id '+
                        'where o.id = ?;';

    var GET_ORDER_DETAILS_PDF = 'select ' +
                                    'p.id_on_supplier as productId, ' +
                                    'p.name as productName, ' +
                                    'od.product_quantity as productQuantity, ' +
                                    'od.product_unity as productUnity ' +
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

                    for(var i = 0; i < updatedOrder.products.length; i++) {

                        var product = updatedOrder.products[i];
                        orderDetailQuery = orderDetailQuery + ORDER_DETAIL_INSERT;

                        var productParams = [orderId, product.id, product.quantity, product.unity];

                        params = params.concat(productParams);
                    }

                    var orderUpdateQuery = 'UPDATE orders SET church_id = ?, obs = ? where id = ?;';

                    params.push(updatedOrder.churchId);
                    params.push(updatedOrder.obs);
                    params.push(orderId);

                    connection.query(deleteOrderDetailQuery + orderDetailQuery + orderUpdateQuery, params,
                        function(queryError) {

                            if(queryError) {

                                deferred.reject(queryError);
                            }
                            else {

                                deferred.resolve();
                            }

                        });
                });
            },
            getForPdf: function(orderId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query(GET_ORDER_PDF, [orderId],
                        function(queryError, result) {

                            if(queryError) {

                                console.log(queryError);
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