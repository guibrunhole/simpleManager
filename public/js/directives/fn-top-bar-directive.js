(function() {

    'use strict';

    function topBar() {

        return {
            restrict: 'E',
            templateUrl: '../../templates/partials/topBar.html',
            controller: function ($scope) {

            }
        };
    }

    angular.module('app.directives').directive('fnTopBar', [topBar]);
})();