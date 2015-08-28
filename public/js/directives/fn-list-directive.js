(function() {

    'use strict';

    function fnList() {

        return {
            restrict: 'E',
            templateUrl: '../../templates/partials/list.html',
            scope: {
                tableDef: '='
            },
            link: function(scope) {

                scope.moveToTop = function() {

                    angular.element("html, body").animate({ scrollTop: 0 }, "slow");
                };

                angular.element(window).scroll(function(){
                    if (angular.element(window).scrollTop() > 100){
                        angular.element('#scrollTop').fadeIn(250);
                    } else {
                        angular.element('#scrollTop').fadeOut(250);
                    }
                });
                angular.element('#scrollTop').fadeOut(250);
            }
        };
    }

    angular.module('app.directives').directive('fnList', fnList);
})();