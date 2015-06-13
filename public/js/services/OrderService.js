(function() {

    'use strict';

    function orderService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(searchParam) {

                var data = {
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/order', {params: data});
            },
            getById: function(orderId) {

                return $http.get(BASE_API_ADDRESS + '/order/' + orderId);
            },
            remove: function(orderId) {

                return $http.delete(BASE_API_ADDRESS + '/order/' + orderId);
            },
            add: function(newOrder) {

                return $http.post(BASE_API_ADDRESS + '/order', newOrder);
            },
            update: function(orderId, updatedOrder) {

                return $http.put(BASE_API_ADDRESS + '/order/' + orderId, updatedOrder);
            }
        };
    }

    angular.module('app.services').service('OrderService', ['$http', 'BASE_API_ADDRESS', orderService]);
})();