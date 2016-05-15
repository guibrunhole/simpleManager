(function() {

    'use strict';

    function orderListCtrl($scope, OrderService, $route, $modal, $location, AlertService) {

        $scope.setLocationTitle('Pedidos');

        $scope.tableDef = {
            structure: [
                { header: 'Nº Pedido', cell: 'id'},
                { header: 'Nome da Igreja', cell: 'church_name'},
                { header: 'Data', cell: 'created_at', type: 'date'},
                { header: 'Total', cell: 'total'}
            ],
            actions: {
                edit: {
                    onClickFunction: editOrder
                },
                remove: {
                    onClickFunction: removeOrder
                },
                view: {
                    onClickFunction: viewOrder
                },
                getAsPdf: {
                    onClickFunction: getAsPdf
                }
            },
            items: []
        };

        $scope.searchByParam = function(param) {

            OrderService.getAll(param).
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                });
        };

        $scope.newOrder = function() {

            $location.url('/order/new');
        };

        function viewOrder(order) {

            $location.url('/order/view/' + order.id);
        }

        function editOrder(order) {

            $location.url('/order/edit/' + order.id);
        }

        function removeOrder(order) {

            OrderService.remove(order.id)
                .success(function() {

                    AlertService.addSuccess('Pedido removido com sucesso!');
                    $route.reload();
                });
        }

        function getAsPdf(order) {

            $modal.open({
                templateUrl: '../templates/views/Modal/pdfPrint.html',
                backdropClass: 'full-height',
                controller: function($scope, $modalInstance, OrderService, orderId, $window, BASE_API_ADDRESS, AlertService) {

                    $scope.pdf = {
                        name: undefined,
                        address: undefined
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.download = function() {

                        OrderService.getAsPdf(orderId, $scope.pdf.name, $scope.pdf.address)
                            .success(function(result) {

                                $window.open(BASE_API_ADDRESS + '/' + result);
                                $modalInstance.close();
                                AlertService.addSuccess('Relatório gerado com sucesso!');
                            })
                            .error(function(err){
                                console.log(err)
                            });
                    }
                },
                resolve: {
                    orderId: function() {
                        return order.id;
                    }
                }
            });
        }

        function fetchOrders() {

            OrderService.getAll().
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                });
        }

        fetchOrders();
    }

    angular.module('app.controllers').controller('OrderListController', orderListCtrl);
})();