(function() {

    'use strict';

    function churchNewCtrl($scope, $location, ChurchService) {

        $scope.church = {};

        $scope.cancel = function() {

            $location.url('/church');
        };

        $scope.save = function() {

            ChurchService.add($scope.church)
                .success(function() {

                    $location.url('/church');
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };
    }


    angular.module('app.controllers').controller('ChurchNewController', churchNewCtrl);
})();