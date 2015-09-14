(function () {

    'use strict';

    var q = require('q');
    var bcrypt = require('bcrypt-nodejs');

    module.exports = function(dbPool){

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

        return{
            getAll: function(searchParam) {

                var query = 'SELECT * FROM user';
                var queryParams = [];

                if (searchParam){
                    query = query + ' WHERE name LIKE ?';
                    queryParams = ['%' + searchParam + '%'];
                }

                return queryFromPool(function(deferred, connection){

                    connection.query(query, queryParams, function(queryError, rows){

                        if (queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(rows);
                    });
                });
            },
            add: function(newUser) {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newUser.password, salt);

                return queryFromPool(function(deferred, connection) {
                    connection.query('INSERT INTO user (name, login, password, email) VALUES (?, ?, ?, ?)',
                        [newUser.name, newUser.login || null, hash, newUser.email], function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(userId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT name, login, email FROM user WHERE id = ?', [userId], function(queryError, row) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(row);
                    });
                });
            },
            update: function(userId, updatedUser) {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(updatedUser.password, salt);

                return queryFromPool(function(deferred, connection) {

                    connection.query('UPDATE user SET name = ?, login = ?, password = ?, email = ? WHERE id = ?',
                        [updatedUser.name, updatedUser.login|| null, hash, updatedUser.email, userId], function(queryError) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve();
                        });
                });
            },
            removeById: function(userId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM user WHERE id = ?', [userId], function(queryError) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve();
                    });
                });
            },
            getByUsername: function(username) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM user WHERE login = ?', [username], function(queryError, row) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(row[0]);
                    });
                });
            }
        };
    };
})();