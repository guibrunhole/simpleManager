(function () {

    'use strict';

    function productListController($scope, ProductService, $route) {

        $scope.setLocationTitle('Produtos');

        var page = 0;
        $scope.products = [];

        $scope.searchByParam = function(param) {

            page = 1;
            ProductService.getAll(page, param).
                success(function(products) {

                    $scope.products = products;
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.fetchMoreProducts = function() {

            var nextPage = page + 1;
            ProductService.getAll(nextPage).
                success(function(moreProducts) {

                    if(moreProducts.length > 0) {

                        $scope.products = $scope.products.concat(moreProducts);
                        page = nextPage;
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.remove = function(product) {

            ProductService.remove(product.id)
                .success(function() {

                    $route.reload();
                })
                .error(function(err) {

                    console.log(err);
                });
        };

        $scope.newProduct = function() {

            console.log('Hold up! This doesn\'t exist yet :)');
        };

        $scope.moveToTop = function() {

            angular.element("html, body").animate({ scrollTop: 0 }, "slow");
        };

        angular.element(window).scroll(function(){
            if (angular.element(window).scrollTop() > 100){
                angular.element('#scrollTop').fadeIn(250);
            } else {
                angular.element('#scrollTop').fadeOut(250);
            }
        });
        angular.element('#scrollTop').fadeOut(250);
    }

    angular.module('app.controllers').controller('ProductListController', productListController);
})();