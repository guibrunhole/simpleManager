(function() {

    'use strict';

    function orderEditController($scope, OrderService, $routeParams, ProductService, ChurchService, $location, AlertService) {

        $scope.setLocationTitle('Pedidos > Editar');

        $scope.order = {
            obs: undefined,
            churchId: undefined,
            products: []
        };

        $scope.church = undefined;

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
            product_quantity: undefined,
            product_unity: undefined
        };

        function loadOrder() {

            OrderService.getById($routeParams.orderId)
                .success(function(order) {
                    $scope.order = order;
                })
                .error(function() {

                    $location.url('/order');
                });
        }

        loadOrder();

        $scope.save = function() {

            OrderService.update($routeParams.orderId, $scope.order)
                .success(function() {

                    AlertService.addSuccess('Pedido alterado com sucesso!');
                    $location.url('/order');
                });
        };

        $scope.addProduct = function() {

            if(!$scope.product.name || !$scope.product.product_quantity || !$scope.product.product_unity) {
                AlertService.addError("É necessário informar todos os campos do produto.");
                return;
            }

            $scope.order.orderDetails.push(angular.copy($scope.product));

            $scope.product.name = undefined;
            $scope.product.product_unity = undefined;
            $scope.product.product_unity = undefined;
        };

        $scope.getProducts = function(searchParam) {

            return ProductService.getAll(searchParam)
                .then(function(res) {

                    return res.data;
                });
        };

        $scope.setProduct = function(selectedItem) {

            $scope.product.productId = angular.copy(selectedItem.id);
        };

        $scope.remove = function(itemIndex) {

            $scope.order.orderDetails.splice(itemIndex, 1);
        };

        $scope.back = function() {

            $location.url('/order');
        };
    }



    angular.module('app.controllers').controller('OrderEditController', orderEditController);
})();