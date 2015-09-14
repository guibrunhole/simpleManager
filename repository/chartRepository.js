/**
 * Created by asus on 26/06/2015.
 */
(function(){

    'use strict';

    var q = require('q');

    module.exports = function (dbPool) {

        function queryFromPool(queryCallBack){
            var deferred = q.defer();

            dbPool.getConnection(function(connectionError, connection){

                if(connectionError){
                    deferred.reject(connectionError);
                } else {
                    queryCallBack(deferred, connection);
                    connection.release();
                }
            });

            return deferred.promise;
        }

        return {
            getQuantity: function () {

                var query = 'SELECT name, price FROM products';

                return queryFromPool(function (deferred, connection) {

                    connection.query(query, function (queryError, rows) {

                        if (queryError)
                            deferred.reject(queryError);
                        else
                            deferred.resolve(rows);
                    });
                })
            }
        };

    }

})();