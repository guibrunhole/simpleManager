(function() {

    'use strict';

    function mainController($scope) {

        $scope.message = 'Eu sou a tela principal :)';

        $scope.setLocationTitle('HOME');
    }

    angular.module('app.controllers').controller('MainController', mainController);
})();