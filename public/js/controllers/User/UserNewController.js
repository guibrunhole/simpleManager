(function() {

    'use strict';

    function userNewCtrl($scope, $location, UserService, AlertService) {

        $scope.user = {};

        $scope.cancel = function() {

            $location.url('/user');
        };

        $scope.save = function() {

            UserService.add($scope.user)
                .success(function() {

                    AlertService.addSuccess('Usuario incluido com sucesso!');
                    $location.url('/user');

                });
        };
    }


    angular.module('app.controllers').controller('UserNewController', userNewCtrl);
})();