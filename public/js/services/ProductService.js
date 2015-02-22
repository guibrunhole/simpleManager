(function () {

    'use strict';

    function productService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(page) {

                return $http.get(BASE_API_ADDRESS + '/product' + '?page=' + page);
            }
        };
    }

    angular.module('app.services').factory('ProductService', ['$http', 'BASE_API_ADDRESS', productService]);
})();