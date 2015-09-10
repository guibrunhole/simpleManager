(function() {

    'use strict';

    function openOrderService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(searchParam) {

                var data = {
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/openOrder', {params: data});
            }
        };
    }

    angular.module('app.services').service('OpenOrderService', ['$http', 'BASE_API_ADDRESS', openOrderService]);
})();