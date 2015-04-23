(function() {

    'use strict';

    function churchListCtrl($scope) {

        $scope.test = "Hello World!!";
    }

    angular.module('app.controllers').controller('ChurchListController', churchListCtrl);
})();