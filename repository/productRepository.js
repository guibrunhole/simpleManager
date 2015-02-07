(function() {

    'use strict';

    var q = require('q');

    module.exports = function(dbPool) {

        return {
            getAll: function() {

                var deferred = q.defer();
                dbPool.getConnection(function(err, connection){

                    connection.query('SELECT * FROM products', null, function(err, rows)
                    {

                        deferred.resolve(rows);
                        connection.release();
                    });
                });

                return deferred.promise;
            },
            add: function(newProduct) {

                var deferred = q.defer();
                dbPool.getConnection(function(connectionError, connection) {

                    connection.query('INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
                        [newProduct.name, newProduct.description || null, newProduct.price], function(queryError, resultInfo) {

                        deferred.resolve(resultInfo.insertId);
                        connection.release();
                    });
                });

                return deferred.promise;
            },
            getById: function(productId) {

                var deferred = q.defer();

                dbPool.getConnection(function(connectionError, connection) {

                    connection.query('SELECT * FROM products WHERE id = ?', [productId], function(queryError, row) {

                        deferred.resolve(row);
                        connection.release();
                    });
                });

                return deferred.promise;
            },
            update: function(productId, updatedProduct) {

                var deferred = q.defer();
                dbPool.getConnection(function(connectionError, connection) {

                    connection.query('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
                        [updatedProduct.name, updatedProduct.description || null, updatedProduct.price, productId], function(queryError) {

                        deferred.resolve();
                        connection.release();
                    });
                });

                return deferred.promise;
            },
            removeById: function(productId) {

                var deferred = q.defer();
                dbPool.getConnection(function(connectionError, connection) {

                    connection.query('DELETE FROM products WHERE id = ?', [productId], function(queryError) {

                        deferred.resolve();
                        connection.release();
                    });
                });

                return deferred.promise;
            }
        };
    };
})();