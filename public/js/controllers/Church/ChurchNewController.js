(function() {

    'use strict';

    function churchNewCtrl($scope, $modalInstance, ChurchService) {

        $scope.church = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {

            ChurchService.add($scope.church)
                .success(function() {

                    $modalInstance.close($scope.church);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };
    }


    angular.module('app.controllers').controller('ChurchNewController', churchNewCtrl);
})();