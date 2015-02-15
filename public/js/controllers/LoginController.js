(function() {

    'use strict';

    function loginController($scope, AuthorizationService, SessionService, $location) {

        $scope.setOnLoginScreen(true);

        $scope.credentials = {
            login: undefined,
            password: undefined
        };

        $scope.login = function() {

            AuthorizationService.attemptLogin($scope.credentials)
                .success(function(data) {

                    SessionService.createSession(data);
                    $scope.setLoggedUser($scope.credentials.login);
                    $location.url('/');
                })
                .error(function(err) {

                    console.log(err);
                });
        };

        $scope.$on('$destroy', function() {

            $scope.setOnLoginScreen(false);
        });
    }

    angular.module('app.controllers').controller('LoginController', loginController);
})();