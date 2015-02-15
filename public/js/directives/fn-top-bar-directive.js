(function() {

    'use strict';

    function topBar() {

        return {
            restrict: 'E',
            templateUrl: '../../templates/partials/topBar.html',
            controller: function ($scope) {

                var menuState = false;

                $scope.switchMenu = function() {

                    if(menuState) {

                        angular.element('.top-bar-menu-container').hide();
                        menuState = false;
                    } else {

                        angular.element('.top-bar-menu-container').show();
                        menuState = true;
                    }
                };
            }
        };
    }

    angular.module('app.directives').directive('fnTopBar', [topBar]);
})();