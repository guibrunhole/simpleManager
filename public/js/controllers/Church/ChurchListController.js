(function () {

    'use strict';

    function churchListController($scope, ChurchService, $route, $modal, $location) {

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
                })
                .error(function(err) {

                    console.error(err);
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
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        function fetchChurches() {

            ChurchService.getAll().
                success(function(churches) {

                    if(churches && churches.length > 0) {

                        $scope.tableDef.items = angular.copy(churches);
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        }

        fetchChurches();
    }

    angular.module('app.controllers').controller('ChurchListController', churchListController);
})();