(function() {

    'use strict';

    function orderService($http, BASE_API_ADDRESS, $window) {

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
            },
            getAsPdf: function(orderId, pdfName, sendTo) {
                //ALTEREI AQUI PARA ACEITAR O CORPO DO EMAIL
                var data = {
                    pdfName: pdfName,
                    sendTo: sendTo
                };
                return $http.get(BASE_API_ADDRESS + '/order/' + orderId + '/pdf', {params: data});
            }
        };
    }

    angular.module('app.services').service('OrderService', ['$http', 'BASE_API_ADDRESS', '$window', orderService]);
})();