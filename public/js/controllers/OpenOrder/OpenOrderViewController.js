(function() {

    'use strict';

    function openOrderViewCtrl($scope, OpenOrderService, $routeParams, $location) {

        $scope.order = undefined;

        function loadOrder() {

            OpenOrderService.getById($routeParams.orderId)
                .success(function(order) {

                    $scope.order = order;
                })
                .error(function() {

                    $location.url('/openOrder');
                });
        }

        loadOrder();

        $scope.back = function() {

            $location.url('/openOrder');
        };
    }

    angular.module('app.controllers').controller('OpenOrderViewController', openOrderViewCtrl);
})();