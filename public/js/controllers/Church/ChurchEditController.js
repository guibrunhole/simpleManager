(function() {

    'use strict';

    function churchEditCtrl($scope, $modalInstance, ChurchService, churchId) {

        $scope.church = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.update = function() {

            ChurchService.update(churchId, $scope.church)
                .success(function() {

                    $modalInstance.close($scope.church);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        function load() {

            ChurchService.getById(churchId)
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