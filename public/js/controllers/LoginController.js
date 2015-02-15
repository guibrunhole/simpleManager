(function() {

    'use strict';

    function loginController($scope, LoginService) {

        $scope.setOnLoginScreen(true);

        $scope.credentials = {
            login: undefined,
            password: undefined
        };

        $scope.login = function() {

            LoginService.attemptLogin($scope.credentials)
                .success(function(data) {

                    console.log(data);
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