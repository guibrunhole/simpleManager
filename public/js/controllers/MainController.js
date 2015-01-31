(function() {

    'use strict';

    function mainController($scope) {

        $scope.message = 'WASSUP SON!';
    }

    angular.module('app.controllers').controller('MainController', mainController);
})();