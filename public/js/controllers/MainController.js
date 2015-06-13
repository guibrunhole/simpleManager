(function() {

    'use strict';

    function mainController($scope) {

        $scope.setLocationTitle('Home');

        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
        });

        //GraphService.loadMain()
        //    .success(function(json) {
        //        chart.load(json);
        //    });
    }

    angular.module('app.controllers').controller('MainController', mainController);
})();