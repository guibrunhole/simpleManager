(function () {

    'use strict';

    function productService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(page, searchParam) {

                var data = {
                    page: page,
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/product', {params: data});
            },
            remove: function(productId) {

                return $http.delete(BASE_API_ADDRESS + '/product/' + productId);
            }
        };
    }

    angular.module('app.services').factory('ProductService', ['$http', 'BASE_API_ADDRESS', productService]);
})();