(function() {

    'use strict';

    function userEditCtrl($scope, $modalInstance, UserService, userId) {

        $scope.user = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.update = function() {

            UserService.update(userId, $scope.user)
                .success(function() {

                    $modalInstance.close($scope.user);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };

        function load() {

            UserService.getById(userId)
                .success(function(user) {

                    $scope.user = angular.copy(user);
                })
                .error(function () {

                    console.log('ohh mannn!');
                });
        }

        load();
    }

    angular.module('app.controllers').controller('UserEditController', userEditCtrl);
})();