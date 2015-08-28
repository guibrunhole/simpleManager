(function() {

    'use strict';

    function churchEditCtrl($scope, $location, ChurchService, $routeParams) {

        $scope.church = {};

        $scope.cancel = function() {

            $location.url('/church');
        };

        $scope.update = function() {

            ChurchService.update($routeParams.id, $scope.church)
                .success(function() {

                    $location.url('/church');
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        function load() {

            ChurchService.getById($routeParams.id)
                .success(function(church) {

                    $scope.church = angular.copy(church);
                })
                .error(function () {

                    console.log('ohh mannn!');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('ChurchEditController', churchEditCtrl);
})();