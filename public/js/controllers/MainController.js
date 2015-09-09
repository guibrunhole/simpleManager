(function() {

    'use strict';

    function mainController($scope, ChartService) {

        $scope.setLocationTitle('Home');

        ChartService.getQuantity().success(function(data) {

            var chart = c3.generate({
                data: {
                    json: data,
                    keys: {
                        // x: 'name', // it's possible to specify 'x' when category axis
                        value: ['price']
                    },
                    type: 'area-spline'
                }
            });

            var chart1 = c3.generate({
                bindto: '#chart1',
                data: {
                    json: data,
                    keys: {
                        // x: 'name', // it's possible to specify 'x' when category axis
                        value: ['price']
                    },
                    type: 'area-spline'
                }
            });
        });
    }

    angular.module('app.controllers').controller('MainController', mainController);
})();