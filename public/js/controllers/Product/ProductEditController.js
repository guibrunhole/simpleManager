(function() {

    'use strict';

    function productEditCtrl($scope, $location, ProductService, AlertService, $routeParams) {

        $scope.product = {};

        $scope.cancel = function() {

            $location.url('/product');
        };

        $scope.update = function() {

            ProductService.update($routeParams.id, $scope.product)
                .success(function() {

                    AlertService.addSuccess('Produto editado com sucesso!');
                    $location.url('/product');
                });
        };

        function load() {

            ProductService.getById($routeParams.id)
                .success(function(product) {

                    $scope.product = angular.copy(product);
                })
                .error(function () {

                    $location.url('/product');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('ProductEditController', productEditCtrl);
})();