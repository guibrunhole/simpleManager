(function() {

    'use strict';

    function loginController($scope, LoginService, AlertService, $location) {

        $scope.setOnLoginScreen(true);

        $scope.credentials = {
            username: undefined,
            password: undefined
        };

        $scope.login = function() {

            LoginService.attemptLogin($scope.credentials)
                .success(function() {

                    $scope.setOnLoginScreen(false);
                    $location.path('/');
                })
                .error(function() {

                    AlertService.addError('Usu\u00e1rio e\/ou senha errados! Sorry mate :(');
                });
        };

        $scope.$on('$destroy', function() {

            $scope.setOnLoginScreen(false);
        });
    }

    angular.module('app.controllers').controller('LoginController', loginController);
})();