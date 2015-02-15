(function () {

    'use strict';

    function appController($scope) {

        $scope.onLoginScreen = false;
        $scope.loggedUser = undefined;

        $scope.setOnLoginScreen = function(onLoginScreen) {

            $scope.onLoginScreen = onLoginScreen;
        };

        $scope.setLoggedUser = function(user) {

            $scope.loggedUser = user;
        };
    }

    angular.module('app.controllers').controller('ApplicationController', appController);
})();