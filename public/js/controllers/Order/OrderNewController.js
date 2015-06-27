(function() {

    'use strict';

    function orderNewCtrl($scope, OrderService, ProductService, ChurchService, $location) {

        $scope.setLocationTitle('Pedidos > Novo');

        $scope.order = {
            churchId: undefined,
            products: []
        };

        $scope.unities = [
            {label: 'Unidade', value: 'UN'},
            {label: 'Galão', value: 'GL'},
            {label: 'Litro', value: 'LT'},
            {label: 'Pacote', value: 'PCT'},
            {label: 'Caixa', value: 'CX'}
        ];

        $scope.cancel = function() {

            $location.url('/order');
        };

        $scope.save = function() {

            $scope.order.products = $scope.products.filter(function(product) {
                return !!product.quantity;
            });

            OrderService.add($scope.order)
                .success(function() {

                    $location.url('/order');
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        $scope.getChurches = function(searchParam) {

            return ChurchService.getAll(searchParam)
                .then(function(res) {

                    return res.data;
                });
        };

        $scope.setChurch = function(selectedItem) {

            $scope.order.churchId = angular.copy(selectedItem.id);
        };

        function loadProducts() {

            ProductService.getAll()
                .success(function(products) {

                    $scope.products = products;
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        loadProducts();
    }

    angular.module('app.controllers').controller('OrderNewController', orderNewCtrl)
})();
