(function() {

    'use strict';

    function orderNewCtrl($scope, $modalInstance, OrderService, ProductService) {

        $scope.order = [];

        $scope.unities = [
            {label: 'Unidade', value: 'UN'},
            {label: 'Galão', value: 'GL'},
            {label: 'Litro', value: 'LT'},
            {label: 'Pacote', value: 'PCT'},
            {label: 'Caixa', value: 'CX'}
        ];

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {

            OrderService.add($scope.order)
                .success(function() {

                    $modalInstance.close($scope.order);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        function loadProducts() {

            ProductService.getAll()
                .success(function(products) {

                    $scope.order = products;
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        loadProducts();
    }

    angular.module('app.controllers').controller('OrderNewController', orderNewCtrl)
})();