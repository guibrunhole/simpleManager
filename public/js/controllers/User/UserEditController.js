(function() {

    'use strict';

    function userEditCtrl($scope, $location, UserService, $routeParams, AlertService) {

        $scope.user = {};

        $scope.cancel = function() {

            $location.url('/user');
        };

        $scope.update = function() {

            UserService.update($routeParams.id, $scope.user)
                .success(function() {

                    AlertService.addSuccess('Usuario editado com sucesso!');
                    $location.url('/user');
                });
        };

        function load() {

            UserService.getById($routeParams.id)
                .success(function(user) {

                    $scope.user = angular.copy(user);
                })
                .error(function () {

                    $location.url('/user');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('UserEditController', userEditCtrl);
})();