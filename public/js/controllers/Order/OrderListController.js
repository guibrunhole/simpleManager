(function() {

    'use strict';

    function orderListCtrl($scope, OrderService, $route, $modal, $location) {

        $scope.setLocationTitle('Pedidos');

        $scope.tableDef = {
            structure: [
                { header: 'Nº Pedido', cell: 'id'},
                { header: 'Nome da Igreja', cell: 'church_name'},
                { header: 'Data', cell: 'created_at', type: 'date'}
            ],
            actions: {
                edit: {
                    onClickFunction: editOrder
                },
                remove: {
                    onClickFunction: removeOrder
                }
            },
            items: []
        };

        $scope.searchByParam = function(param) {

            OrderService.getAll(param).
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.newOrder = function() {

            $location.url('/order/new');
        };

        function editOrder(order) {

            var modalInstance = $modal.open({
                templateUrl: '../templates/views/Order/orderEdit.html',
                backdropClass: 'full-height',
                controller: 'OrderEditController',
                resolve: {
                    orderId: function() {

                        return order.id;
                    }
                }
            });

            modalInstance.result.then(function() {

                $route.reload();
                console.log('Order updated like a champ!');
            });
        }

        function removeOrder(order) {

            OrderService.remove(order.id)
                .success(function() {

                    $route.reload();
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        function fetchOrders() {

            OrderService.getAll().
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                })
                .error(function(err) {

                    console.error(err);
                });
        }

        fetchOrders();
    }

    angular.module('app.controllers').controller('OrderListController', orderListCtrl);
})();