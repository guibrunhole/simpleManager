(function () {

    'use strict';

    function appController($scope, LoginService, $location) {

        $scope.onLoginScreen = false;
        $scope.loggedUser = undefined;
        $scope.locationTitle = undefined;
        $scope.location = $location;

        $scope.changeView = function(nextView) {

            $location.url(nextView);
        };

        $scope.setOnLoginScreen = function(onLoginScreen) {

            $scope.onLoginScreen = onLoginScreen;
        };

        $scope.setLoggedUser = function(user) {

            $scope.loggedUser = user;
        };

        $scope.setLocationTitle = function(newTitle) {

            $scope.locationTitle = newTitle;
        };

        $scope.logout = function() {

            LoginService.logout()
                .success(function() {

                    $location.url('/login');
                });
        };
    }

    angular.module('app.controllers').controller('ApplicationController', appController);
})();