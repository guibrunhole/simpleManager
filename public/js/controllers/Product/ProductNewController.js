(function() {

    'use strict';

    function productNewCtrl($scope, $modalInstance, ProductService) {

        $scope.product = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {

            ProductService.add($scope.product)
                .success(function() {

                    $modalInstance.close($scope.product);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };
    }


    angular.module('app.controllers').controller('ProductNewController', productNewCtrl);
})();