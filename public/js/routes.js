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
                templateUrl: '/templates/views/Product/productList.html',
                controller: 'ProductListController',
                access: {
                    requireLogin: true
                }
            })
            .when('/church', {
                templateUrl: '/templates/views/churchList.html',
                controller: 'ChurchListController',
                access: {
                    requireLogin: true
                }
            })
            .when('/order', {
                templateUrl: '/templates/views/Order/orderList.html',
                controller: 'OrderListController',
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