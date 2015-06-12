(function () {

    'use strict';

    function churchListController($scope, ChurchService) {

        $scope.setLocationTitle('Igrejas');

        var page = 0;
        $scope.churches = [];

        $scope.searchByParam = function(param) {

            page = 1;
            ChurchService.getAll(page, param).
                success(function(churches) {

                    $scope.churches = churches;
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.fetchMoreChurches = function() {

            var nextPage = page + 1;
            ChurchService.getAll(nextPage).
                success(function(moreChurches) {

                    if(moreChurches.length > 0) {

                        $scope.churches = $scope.churches.concat(moreChurches);
                        page = nextPage;
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.newChurch = function() {

            console.log('Hold up! This doesn\'t exist yet :)');
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

    angular.module('app.controllers').controller('ChurchListController', churchListController);
})();