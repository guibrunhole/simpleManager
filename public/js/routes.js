(function() {

    'use strict';

    function routesConfig($routeProvider) {

        $routeProvider.when('/', {
            templateUrl: '/templates/views/main.html',
            controller: 'MainController'
        }).otherwise({
            redirectTo: '/'
        });
    }

    angular.module('app').config(['$routeProvider', routesConfig]);

})();