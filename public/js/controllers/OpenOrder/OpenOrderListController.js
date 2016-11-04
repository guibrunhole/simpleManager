(function() {

    'use strict';

    function openOrderList($scope, OpenOrderService, $route, $modal, $location, AlertService) {

        $scope.tableDef = {
            structure: [
                { header: 'Nº Pedido', cell: 'id'},
                { header: 'Nome da Igreja', cell: 'church_name'},
                { header: 'Data', cell: 'created_at', type: 'date'}
            ],
            actions: {
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

            OpenOrderService.getAll(param).
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                });
        };

        $scope.newOrder = function() {

            $location.url('/openOrder/new');
        };

        function viewOrder(order) {

            $location.url('/openOrder/view/' + order.id);
        }

        function removeOrder(order) {

            OpenOrderService.remove(order.id)
                .success(function() {

                    AlertService.addSuccess('Pedido removido com sucesso!');
                    $route.reload();
                });
        }

        function getAsPdf(order) {

            $modal.open({
                templateUrl: '../templates/views/Modal/pdfPrint.html',
                backdropClass: 'full-height',
                controller: function($scope, $modalInstance, OpenOrderService, orderId, $window, BASE_API_ADDRESS, AlertService) {

                    $scope.pdf = {
                        name: undefined,
                        address: undefined
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.download = function() {

                        OpenOrderService.getAsPdf(orderId, $scope.pdf.name, $scope.pdf.address)
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

            OpenOrderService.getAll().
                success(function(orders) {

                    $scope.tableDef.items = angular.copy(orders);
                });
        }

        fetchOrders();
    }

    angular.module('app.controllers').controller('OpenOrderListController', openOrderList);
})();