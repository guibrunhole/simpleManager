(function() {

    'use strict';

    var q = require('q');

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

                var query = 'SELECT * FROM church';
                var queryParams = [];

                if(searchParam) {
                    query = query + ' WHERE name like ?';
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
            add: function(newChurch) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('INSERT INTO church (name, user_id, cnpj, address, city, state, zipcode, phone_number, responsible_buyer, state_registration) ' +
                                        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [newChurch.name, newChurch.user_id || null, newChurch.cnpj, newChurch.address, newChurch.city,
                            newChurch.state, newChurch.zipcode || null, newChurch.phone_number, newChurch.responsible_buyer, newChurch.state_registration], function(queryError, resultInfo) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve(resultInfo.insertId);
                        });
                });
            },
            getById: function(churchId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('SELECT * FROM church WHERE id = ?', [churchId], function(queryError, row) {

                        if(queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(row);
                    });
                });
            },
            update: function(churchId, updatedChurch) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('UPDATE church SET name = ?, user_id = ?, cnpj = ?' +
                        ', address = ?, city = ?, state = ?, zipcode = ?, phone_number = ?, responsible_buyer = ?' +
                        ', state_registration = ? WHERE id = ?',
                        [updatedChurch.name, updatedChurch.user_id || null, updatedChurch.cnpj,
                            updatedChurch.address, updatedChurch.city, updatedChurch.state, updatedChurch.zipcode || null,
                            updatedChurch.phone_number, updatedChurch.responsible_buyer, updatedChurch.state_registration ,churchId], function(queryError) {

                            if(queryError)
                                deferred.reject(queryError);
                            else
                                deferred.resolve();
                        });
                });
            },
            removeById: function(churchId) {

                return queryFromPool(function(deferred, connection) {

                    connection.query('DELETE FROM church WHERE id = ?', [churchId], function(queryError) {

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