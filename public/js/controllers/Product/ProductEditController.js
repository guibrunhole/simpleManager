(function() {

    'use strict';

    function productEditCtrl($scope, $modalInstance, ProductService, productId) {

        $scope.product = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.update = function() {

            ProductService.update(productId, $scope.product)
                .success(function() {

                    $modalInstance.close($scope.product);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        function load() {

            ProductService.getById(productId)
                .success(function(product) {

                    $scope.product = angular.copy(product);
                })
                .error(function () {

                    console.log('ohh mannn!');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('ProductEditController', productEditCtrl);
})();