(function () {

    'use strict';

    function appController($scope, $interval, AuthorizationService, SessionService, $location) {

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

            SessionService.destroySession();
            $location.url('/login');
        };

        $interval(function() {

            var expirationDate = SessionService.getExpirationDate();

            if(expirationDate && expirationDate < new Date().getTime()) {

                AuthorizationService.refreshToken()
                    .success(function(data) {

                        SessionService.updateSession(data);
                    })
                    .error(function() {

                        SessionService.destroySession();
                    });
            }
        }, 1000);
    }

    angular.module('app.controllers').controller('ApplicationController', appController);
})();