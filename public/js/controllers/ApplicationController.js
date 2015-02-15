(function () {

    'use strict';

    function appController($scope, $interval, AuthorizationService, SessionService) {

        $scope.onLoginScreen = false;
        $scope.loggedUser = undefined;

        $scope.setOnLoginScreen = function(onLoginScreen) {

            $scope.onLoginScreen = onLoginScreen;
        };

        $scope.setLoggedUser = function(user) {

            $scope.loggedUser = user;
        };

        $interval(function() {

            var expirationDate = SessionService.getExpirationDate();

            if(expirationDate && expirationDate < new Date().getTime()) {

                AuthorizationService.refreshToken()
                    .success(function(data) {

                        SessionService.updateSession(data);
                    })
                    .error(function(err) {

                        console.log(err);
                        SessionService.destroySession();
                    });
            }
        }, 1000);
    }

    angular.module('app.controllers').controller('ApplicationController', appController);
})();