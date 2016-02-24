(function() {

    'use strict';

    function orderNewCtrl($scope, OrderService, ProductService, ChurchService, $location, AlertService) {

        $scope.order = {
            churchId: undefined,
            products: []
        };

        $scope.unities = [
            {label: 'Unidade', value: 'UN'},
            {label: 'Galão', value: 'GL'},
            {label: 'Litro', value: 'LT'},
            {label: 'Pacote', value: 'PCT'},
            {label: 'Caixa', value: 'CX'},
            {label: 'Fardo', value: 'FD'}
        ];

        $scope.product = {
            name: undefined,
            quantity: undefined,
            unity: undefined
        };

        $scope.addProduct = function() {

            if(!$scope.product.name || !$scope.product.quantity || !$scope.product.unity) {
                AlertService.addError("É necessário informar todos os campos do produto.");
                return;
            }

            $scope.order.products.push(angular.copy($scope.product));

            $scope.product.name = undefined;
            $scope.product.quantity = undefined;
            $scope.product.unity = undefined;
        };

        $scope.cancel = function() {

            $location.url('/order');
        };

        $scope.save = function() {
            OrderService.add($scope.order)
                .success(function() {

                    AlertService.addSuccess('Pedido incluido com sucesso!');
                    $location.url('/order');
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

        $scope.getProducts = function(searchParam) {

            return ProductService.getAll(searchParam)
                .then(function(res) {

                    return res.data;
                });
        };

        $scope.setProduct = function(selectedItem) {

            debugger;
            $scope.product.productId = angular.copy(selectedItem.id);
        };

        function loadProducts() {

            ProductService.getAll()
                .success(function(products) {

                    $scope.products = products;
                });
        }

        loadProducts();

        $scope.remove = function(itemIndex) {

            $scope.order.products.splice(itemIndex, 1);
        }
    }

    angular.module('app.controllers').controller('OrderNewController', orderNewCtrl)
})();
