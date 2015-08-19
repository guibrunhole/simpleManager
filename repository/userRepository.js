(function () {

    'use strict';

    var q = require('q');
    var bcrypt = require('bcrypt-nodejs');

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

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newUser.password, salt);

                return queryFromPool(function(deferred, connection) {
                    connection.query('INSERT INTO user (name, login, password, email) VALUES (?, ?, ?, ?)',
                        [newUser.name, newUser.login || null, hash, newUser.email], function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject();
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(userId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT name, login, email FROM user WHERE id = ?', [userId], function(queryError, row) {

                        if(queryError)
                            deferred.reject();
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
            },
            getAccessToken: function(bearerToken, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('SELECT access_token, client_id, expires, user_id FROM access_tokens ' +
                        'WHERE access_token = ?', [bearerToken],
                        function(queryError, row) {

                        if(queryError || !row[0])
                            deferred.reject(queryError);
                        else
                            deferred.resolve(row[0]);
                    });
                }).then(function(token) {

                    callback(null, {
                        accessToken: token.access_token,
                        clientId: token.client_id,
                        expires: token.expires,
                        userId: token.user_id
                    });
                }, function(err) {

                    return callback(err);
                });
            },
            getClient: function(clientId, clientSecret, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('SELECT client_id, client_secret, redirect_uri FROM clients WHERE ' +
                        'client_id = ?', [clientId],
                        function(queryError, row) {

                            if(queryError || !row[0])
                                deferred.reject(queryError);
                            else
                                deferred.resolve(row[0]);
                        });
                }).then(function(client) {

                    callback(null, {
                        clientId: client.client_id,
                        clientSecret: client.client_secret
                    });
                }, function(err) {

                    return callback(err);
                });
            },
            getRefreshToken: function(bearerToken, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('SELECT refresh_token, client_id, expires, user_id FROM refresh_tokens ' +
                        'WHERE refresh_token = ?', [bearerToken],
                        function(queryError, row) {

                            if(queryError || !row[0])
                                deferred.reject(queryError);
                            else
                                deferred.resolve(row[0]);
                        });
                }).then(function(refreshToken) {

                    callback(null, {
                        refreshToken: refreshToken.refresh_token,
                        clientId: refreshToken.client_id,
                        expires: refreshToken.expires,
                        userId: refreshToken.user_id
                    });
                }, function(err) {

                    return callback(err, false);
                });
            },
            grantTypeAllowed: function(clientId, grantType, callback) {

                callback(null, true);
            },
            saveAccessToken: function(accessToken, clientId, expires, userId, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO access_tokens(access_token, client_id, user_id, expires) ' +
                        'VALUES (?, ?, ?, ?)', [accessToken, clientId, userId, expires],
                        function(queryError) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve();
                        });
                }).then(function() {

                    callback();
                }, function(err) {

                    return callback(err);
                });
            },
            saveRefreshToken: function(refreshToken, clientId, expires, userId, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO refresh_tokens(refresh_token, client_id, user_id, ' +
                        'expires) VALUES (?, ?, ?, ?)', [refreshToken, clientId, userId, expires],
                        function(queryError) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve();
                        });
                }).then(function() {

                    callback();
                }, function(err) {

                    return callback(err);
                });
            },
            getUser: function(username, password, callback) {

                queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM user WHERE login = ?',
                        [username, password],
                        function(queryError, results) {

                            if(queryError)
                                deferred.reject(queryError);

                            var user = results[0];

                            bcrypt.compare(password, user.password, function(err, res) {
                                if(err)
                                    deferred.reject(err);

                                if(!res)
                                    deferred.reject('Incorrect password.');

                                deferred.resolve(user.id);
                            });
                        });
                }).then(function(user) {

                    callback(null, user);
                }, function(err) {

                    return callback(err, false);
                });
            }
        };
    };
})();