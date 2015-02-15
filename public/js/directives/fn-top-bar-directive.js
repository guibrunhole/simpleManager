(function() {

    'use strict';

    function topBar() {

        return {
            restrict: 'E',
            templateUrl: '../../templates/partials/topBar.html',
            controller: function ($scope) {

                var menuState = false;

                function bindMenuClosingEvent(elem) {

                    $(document).mouseup(function (e)
                    {
                        var container = $('.top-bar-menu-container');
                        var menuButton = $('.navbar-default .navbar-brand .top-bar-menu-icon');
                        if (!container.is(e.target) && container.has(e.target).length === 0 && !menuButton.is(e.target)) {

                            container.fadeOut(250);
                            menuState = false;
                            $(document).unbind('mouseup');
                        }
                    });
                }

                $scope.switchMenu = function() {

                    if(menuState) {

                        angular.element('.top-bar-menu-container').fadeOut(250);
                        menuState = false;
                    } else {

                        angular.element('.top-bar-menu-container').fadeIn(250);
                        menuState = true;
                        bindMenuClosingEvent();
                    }
                };
            }
        };
    }

    angular.module('app.directives').directive('fnTopBar', [topBar]);
})();