(function () {

    'use strict';

    function productService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(searchParam) {

                var data = {
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/product', {params: data});
            },
            getById: function(productId) {

                return $http.get(BASE_API_ADDRESS + '/product/' + productId);
            },
            remove: function(productId) {

                return $http.delete(BASE_API_ADDRESS + '/product/' + productId);
            },
            add: function(newProduct) {

                return $http.post(BASE_API_ADDRESS + '/product', newProduct);
            },
            update: function(productId, updatedProduct) {

                return $http.put(BASE_API_ADDRESS + '/product/' + productId, updatedProduct);
            }
        };
    }

    angular.module('app.services').factory('ProductService', ['$http', 'BASE_API_ADDRESS', productService]);
})();