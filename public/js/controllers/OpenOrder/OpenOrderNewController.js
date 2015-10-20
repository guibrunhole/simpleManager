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

            if(!$scope.product.name || !$scope.product.price || !$scope.product.quantity || !$scope.product.unity) {
                AlertService.addError("É necessário informar todos os campos do produto.");
                return;
            }

            $scope.order.products.push(angular.copy($scope.product));

            $scope.product.name = undefined;
            $scope.product.price = undefined;
            $scope.product.quantity = undefined;
            $scope.product.unity = undefined;
        };

        $scope.cancel = function() {

            $location.url('/openOrder');
        };

        $scope.save = function() {

            OpenOrderService.add($scope.order)
                .success(function() {

                    AlertService.addSuccess('Pedido Aberto incluido com sucesso!');
                    $location.url('/openOrder');
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

        $scope.remove = function(itemIndex) {

            $scope.order.products.splice(itemIndex, 1);
        }
    }
    angular.module('app.controllers').controller('OpenOrderNewController', openOrderNewCtrl)
})();