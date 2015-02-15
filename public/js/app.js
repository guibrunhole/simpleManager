(function() {

    'use strict';

    angular.module('app.services', []);
    angular.module('app.controllers', []);

    var app = angular.module('app', ['app.services', 'app.controllers', 'ngRoute']);

    app.run(function($rootScope, $location) {

        $rootScope.$on("$routeChangeStart", function(event, nextRoute) {

            if (nextRoute.access.requireLogin) {

                $location.url("/login");
            }
        });
    });
})();