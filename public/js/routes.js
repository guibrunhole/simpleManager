(function() {

    'use strict';

    function routesConfig($routeProvider) {

        $routeProvider
            .when('/login', {
                templateUrl: '/templates/views/login.html',
                controller: 'LoginController',
                access: {
                    requireLogin: false
                }
            })
            .when('/', {
                templateUrl: '/templates/views/main.html',
                controller: 'MainController',
                access: {
                    requireLogin: true
                }
            })
            .otherwise({
                redirectTo: '/login',
                access: {
                    requireLogin: true
                }
            });
    }

    angular.module('app').config(['$routeProvider', routesConfig]);

})();