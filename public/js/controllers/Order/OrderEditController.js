(function() {

    'use strict';

    function orderEditController($scope, OrderService, $routeParams, ProductService, ChurchService, $location) {

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

            ProductService.getAll()
                .success(function(products) {

                    console.log(products);
                    $scope.products = products;

                    OrderService.getById($routeParams.orderId)
                        .success(function(order) {

                            console.log(order);
                            $scope.church = angular.copy(order.church_name);
                            $scope.order.churchId = angular.copy(order.church_id);
                            $scope.order.obs = angular.copy(order.obs);

                            angular.forEach(order.orderDetails, function(orderDetail) {
                                angular.forEach($scope.products, function(product) {

                                    if(product.id === orderDetail.productId) {
                                        product.quantity = orderDetail.product_quantity;
                                        product.unity = orderDetail.product_unity;
                                    }

                                });
                            });
                            //$scope.order = order;
                        })
                        .error(function(err) {

                            console.log(err)
                        });
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        load();

        $scope.save = function() {

            $scope.order.products = $scope.products.filter(function(product) {
                return !!product.quantity;
            });

            OrderService.update($routeParams.orderId, $scope.order)
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

        $scope.back = function() {

            $location.url('/order');
        };
    }

    angular.module('app.controllers').controller('OrderEditController', orderEditController);
})();