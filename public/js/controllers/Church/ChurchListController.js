(function () {

    'use strict';

    function churchListController($scope, ChurchService, $route, $location, AlertService) {

        $scope.setLocationTitle('Igrejas');

        $scope.tableDef = {
            structure: [
                { header: 'Igreja', cell: 'name', altCell: 'Sem nome'},
                { header: 'Endereço', cell: 'address', altCell: 'Sem endereço'},
                { header: 'Cidade', cell: 'city', altCell: 'Sem cidade'},
                { header: 'Telefone', cell: 'phone_number', altCell: 'Sem telefone'}
            ],
            actions: {
                edit: {
                    onClickFunction: editChurch
                },
                remove: {
                    onClickFunction: removeChurch
                }
            },
            items: []
        };

        $scope.searchByParam = function(param) {

            ChurchService.getAll(param).
                success(function(churches) {

                    $scope.tableDef.items = angular.copy(churches);
                });
        };

        $scope.newChurch = function() {

            $location.url('/church/new');

        };

        function editChurch (church) {

            $location.url('/church/edit/' + church.id);
        }

        function removeChurch(church) {

            ChurchService.remove(church.id)
                .success(function() {

                    $route.reload();
                    AlertService.addSuccess("Igreja removida com sucesso!");
                });
        }

        function fetchChurches() {

            ChurchService.getAll().
                success(function(churches) {

                    if(churches && churches.length > 0) {

                        $scope.tableDef.items = angular.copy(churches);
                    }
                });
        }

        fetchChurches();
    }

    angular.module('app.controllers').controller('ChurchListController', churchListController);
})();