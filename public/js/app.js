(function() {

    'use strict';

    angular.module('app.services', []);
    angular.module('app.controllers', []);
    angular.module('app.directives', []);

    var app = angular.module('app', ['app.services', 'app.controllers', 'app.directives',
        'ngRoute', 'ngCookies', 'ui.bootstrap.modal', 'ui.bootstrap.typeahead', 'ui.bootstrap.alert']);

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('ErrorInterceptor');
    });

    app.constant('BASE_API_ADDRESS', process.env.BASE_API_ADDRESS);
})();