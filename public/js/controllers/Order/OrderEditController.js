(function() {

    'use strict';

    function orderEditController($scope, OrderService, $routeParams, ProductService, ChurchService, $location) {

        $scope.setLocationTitle('Pedidos > Editar');

        $scope.order = {
            churchId: undefined,
            products: []
        };

        $scope.unities = {
            UN: 'Unidade(s)',
            GL: 'Gal\u00e3o(\u00f5es)',
            LT: 'Litro(s)',
            PCT: 'Pacote(s)',
            CX: 'Caixa(s)'
        };

        function load() {

            OrderService.getById($routeParams.orderId)
                .success(function(order) {

                    console.log(order);
                    //$scope.order = order;
                })
                .error(function(err) {

                    console.log(err)
                });

            ProductService.getAll()
                .success(function(products) {

                    console.log(products);
                    $scope.products = products;
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        load();

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