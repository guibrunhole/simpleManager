(function() {

    'use strict';

    angular.module('app.services', []);
    angular.module('app.controllers', []);
    angular.module('app.directives', []);

    var app = angular.module('app', ['app.services', 'app.controllers', 'app.directives', 'ngRoute', 'ngCookies']);

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    });

    app.run(function($rootScope, $location, SessionService) {

        $rootScope.$on("$routeChangeStart", function(event, nextRoute) {

            if (nextRoute.access.requireLogin && !SessionService.isLoggedIn()) {

                $location.url('/login');
            }
        });
    });

    app.constant('SESSION_KEYS', {
        accessToken: 'ACCESS_TOKEN_KEY',
        refreshToken: 'REFRESH_TOKEN_KEY',
        expirationDate: 'EXPIRATION_DATE_KEY'
    });
})();