(function() {

    'use strict';

    function userNewCtrl($scope, $modalInstance, UserService) {

        $scope.user = {};

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };

        $scope.save = function() {

            UserService.add($scope.user)
                .success(function() {

                    $modalInstance.close($scope.user);
                })
                .error(function() {

                    console.log('damn ;-;');
                });
        };
    }


    angular.module('app.controllers').controller('UserNewController', userNewCtrl);
})();