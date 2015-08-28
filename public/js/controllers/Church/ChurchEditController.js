(function() {

    'use strict';

    function churchEditCtrl($scope, $location, ChurchService, $routeParams, AlertService) {

        $scope.church = {};

        $scope.cancel = function() {

            $location.url('/church');
        };

        $scope.update = function() {

            ChurchService.update($routeParams.id, $scope.church)
                .success(function() {

                    AlertService.addSuccess('Igreja editada com sucesso!');
                    $location.url('/church');
                });
        };

        function load() {

            ChurchService.getById($routeParams.id)
                .success(function(church) {

                    $scope.church = angular.copy(church);
                })
                .error(function() {

                    $location.url('/church');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('ChurchEditController', churchEditCtrl);
})();