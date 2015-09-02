(function() {

    'use strict';

    function churchNewCtrl($scope, $location, ChurchService, AlertService) {

        $scope.church = {};

        $scope.cancel = function() {

            $location.url('/church');
        };

        $scope.save = function() {

            ChurchService.add($scope.church)
                .success(function() {

                    AlertService.addSuccess('Igreja incluida com sucesso!');
                    $location.url('/church');
                });
        };
    }


    angular.module('app.controllers').controller('ChurchNewController', churchNewCtrl);
})();