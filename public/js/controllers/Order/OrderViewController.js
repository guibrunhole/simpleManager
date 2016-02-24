(function() {

    'use strict';

    function orderView($scope, OrderService, $routeParams, $location) {

        $scope.order = undefined;

        $scope.unities = {
            UN: 'Unidade(s)',
            GL: 'Gal\u00e3o(\u00f5es)',
            LT: 'Litro(s)',
            PCT: 'Pacote(s)',
            CX: 'Caixa(s)',
            FD: 'Fardo(s)'
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

        $scope.back = function() {

            $location.url('/order');
        };
    }

    angular.module('app.controllers').controller('OrderViewController', orderView);
})();