(function() {

    'use strict';

    function fnList() {

        return {
            restrict: 'E',
            templateUrl: '../../templates/partials/list.html',
            scope: {
                tableDef: '='
            },
            controller: function($scope) {

                $scope.items = [];
                var page = 0;

                $scope.$on('UPDATE_LIST', function(ev, newItems) {

                    $scope.items = angular.copy(newItems);
                    page = 1;
                });

                $scope.$on('CONCAT_LIST', function(ev, itemsToConcat) {

                    $scope.items = $scope.items.concat(itemsToConcat);
                    page = page + 1;
                });

                $scope.fetchMoreItems = function() {

                    $scope.tableDef.fetchMoreItems(page + 1);
                };

                $scope.moveToTop = function() {

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