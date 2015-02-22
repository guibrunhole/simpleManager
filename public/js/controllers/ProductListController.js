(function () {

    'use strict';

    function productListController($scope, ProductService) {

        $scope.setLocationTitle('Produtos');

        var page = 0;
        $scope.products = [];

        $scope.fetchMoreProducts = function() {

            page++;
            ProductService.getAll(page).
                success(function(moreProducts) {

                    $scope.products = $scope.products.concat(moreProducts);
                })
                .error(function(err) {

                    console.error('GOD DAMN!!');
                });
        };

        $scope.newProduct = function() {

            console.log('Hold up! This doesn\'t exist yet :)');
        };
    }

    angular.module('app.controllers').controller('ProductListController', productListController);
})();