(function() {

    'use strict';

    function tokenInterceptor($q, $location, SessionService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (SessionService.getAccessToken() && !config.headers.Authorization) {
                    config.headers.Authorization = 'Bearer ' + SessionService.getAccessToken();
                }
                return config;
            },
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401) {

                    SessionService.destroySession();
                    $location.path("/login");
                }

                return $q.reject(rejection);
            }
        };
    }

    angular.module('app.services').factory('TokenInterceptor', ['$q', '$location', 'SessionService', tokenInterceptor]);
})();