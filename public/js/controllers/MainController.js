(function() {

    'use strict';

    function mainController($scope) {

        $scope.setLocationTitle('Home');

        $scope.message = 'Eu sou a tela principal :)';
    }

    angular.module('app.controllers').controller('MainController', mainController);
})();