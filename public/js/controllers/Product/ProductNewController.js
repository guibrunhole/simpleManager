(function() {

    'use strict';

    function productNewCtrl($scope, $location, ProductService, AlertService) {

        $scope.product = {};

        $scope.cancel = function() {

            $location.url('/product');
        };

        $scope.save = function() {

            ProductService.add($scope.product)
                .success(function() {

                    AlertService.addSuccess('Produto incluido com sucesso!');
                    $location.url('/product');
                });
        };
    }


    angular.module('app.controllers').controller('ProductNewController', productNewCtrl);
})();