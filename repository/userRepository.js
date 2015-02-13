(function () {

    'use strict';

    var q = require('q');

    module.exports = function(dbPool){

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

        return{
            getAll: function() {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM user', null, function(queryError, rows) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newUser) {

                return queryFromPool(function(deferred, connection) {
//falta colocar o 'last_login'
                    connection.query('INSERT INTO user (name, login, password, email) VALUES (?, ?, ?, ?)',
                        [newUser.name, newUser.login || null, newProduct.password, newUser.email], function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(userId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM user WHERE id = ?', [userId], function(queryError, row) {

                        if(queryError)
                            deferred.reject();
                        else
                            deferred.resolve(row);
                    });
                });
            },
            update: function(userId, updatedUser) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('UPDATE user SET name = ?, login = ?, password = ?, email = ? WHERE id = ?',
                        [updatedUser.name, updatedUser.login|| null, updatedUser.password, updatedUser.email, userId], function(queryError) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve();
                        });
                });
            },
            removeById: function(userId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM user WHERE id = ?', [userId], function(queryError) {

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