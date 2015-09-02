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
            {label: 'Unidade(s)', value: 'UN'},
            {label: 'Gal\u00e3o(\u00f5es)', value: 'GL'},
            {label: 'Litro(s)', value: 'LT'},
            {label: 'Pacote(s)', value: 'PCT'},
            {label: 'Caixa(s)', value: 'CX'}
        ];

        function load() {

            OrderService.getById($routeParams.orderId)
                .success(function(order) {

                    $scope.church = angular.copy(order.church_name);
                    $scope.order.churchId = angular.copy(order.church_id);
                    $scope.order.obs = angular.copy(order.obs);

                    ProductService.getAll()
                        .success(function(products) {

                            $scope.products = products;

                            angular.forEach(order.orderDetails, function(orderDetail) {
                                angular.forEach($scope.products, function(product) {

                                    if(product.id === orderDetail.productId) {
                                        product.quantity = orderDetail.product_quantity;
                                        product.unity = orderDetail.product_unity;
                                    }

                                });
                            });
                        });
                })
                .error(function(){

                    $location.url('/order');
                });
        }

        load();

        $scope.save = function() {

            $scope.order.products = $scope.products.filter(function(product) {
                return !!product.quantity;
            });

            OrderService.update($routeParams.orderId, $scope.order)
                .success(function() {

                    AlertService.addSuccess('Pedido alterado com sucesso!');
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

        $scope.back = function() {

            $location.url('/order');
        };
    }

    angular.module('app.controllers').controller('OrderEditController', orderEditController);
})();