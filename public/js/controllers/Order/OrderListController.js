(function() {

    'use strict';

    function orderListCtrl($scope) {

        $scope.dude = 'SUP!';
    }

    angular.module('app.controllers').controller('OrderListController', orderListCtrl);
})();