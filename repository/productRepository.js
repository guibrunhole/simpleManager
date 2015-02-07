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

                    connection.query('SELECT * FROM products', null, function(queryError, rows) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newProduct) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
                        [newProduct.name, newProduct.description || null, newProduct.price], function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(productId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM products WHERE id = ?', [productId], function(queryError, row) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(row);
                    });
                });
            },
            update: function(productId, updatedProduct) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
                        [updatedProduct.name, updatedProduct.description || null, updatedProduct.price, productId], function(queryError) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve();
                        });
                });
            },
            removeById: function(productId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM products WHERE id = ?', [productId], function(queryError) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve();
                    });
                });
            }
        };
    };
})();