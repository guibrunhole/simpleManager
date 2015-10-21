(function() {

    'use strict';

    function openOrderService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(searchParam) {

                var data = {
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/openOrder', {params: data});
            },
            add: function(openOrder) {

                return $http.post(BASE_API_ADDRESS + '/openOrder', openOrder);
            },
            remove: function(id) {

                return $http.delete(BASE_API_ADDRESS + '/openOrder/' + id);
            },
            getById: function(orderId) {

                return $http.get(BASE_API_ADDRESS + '/openOrder/' + orderId);
            },
            getAsPdf: function(orderId, pdfName, sendTo) {

                var data = {
                    pdfName: pdfName,
                    sendTo: sendTo
                };
                return $http.get(BASE_API_ADDRESS + '/openOrder/' + orderId + '/pdf', {params: data});
            }
        };
    }

    angular.module('app.services').service('OpenOrderService', ['$http', 'BASE_API_ADDRESS', openOrderService]);
})();