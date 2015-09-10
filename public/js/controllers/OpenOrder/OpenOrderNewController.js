(function() {

    'use strict';

    function openOrderNewCtrl($scope, OpenOrderService, ChurchService, $location, AlertService) {

        $scope.order = {
            churchId: undefined,
            products: []
        };

        $scope.product = {
            name: undefined,
            price: undefined,
            quantity: undefined,
            unity: undefined
        };

        $scope.addProduct = function() {

            $scope.order.products.push(angular.copy($scope.product));
            $scope.product = {
                name: undefined,
                price: undefined,
                quantity: undefined,
                unity: undefined
            };
        };

        $scope.cancel = function() {

            $location.url('/openOrder');
        };

        $scope.save = function() {

            console.log($scope.order);

            //OpenOrderService.add($scope.order)
            //    .success(function() {
            //
            //        AlertService.addSuccess('Pedido Aberto incluido com sucesso!');
            //        $location.url('/openOrder');
            //    });
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
    }
    angular.module('app.controllers').controller('OpenOrderNewController', openOrderNewCtrl)
})();