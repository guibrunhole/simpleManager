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
            .when('/product', {
                templateUrl: '/templates/views/productList.html',
                controller: 'ProductListController',
                access: {
                    requireLogin: true
                }
            })
            .otherwise({
                redirectTo: '/',
                access: {
                    requireLogin: true
                }
            });
    }

    angular.module('app').config(['$routeProvider', routesConfig]);

})();