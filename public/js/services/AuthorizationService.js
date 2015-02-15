(function() {

    'use strict';

    function authService($http, SessionService) {

        return {

            attemptLogin: function(credentials) {

                var loginData = {
                    username: credentials.login,
                    password: credentials.password,
                    grant_type: 'password'
                };

                return $http({
                    method: 'POST',
                    url: '/oauth/token',
                    data: $.param(loginData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': ''
                    }
                });
            },
            refreshToken: function() {

                var refreshData = {
                    grant_type: 'refresh_token',
                    refresh_token: SessionService.getRefreshToken()
                };

                return $http({
                    method: 'POST',
                    url: '/oauth/token',
                    data: $.param(refreshData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': ''
                    }
                });
            }
        };
    }

    angular.module('app.services').service('AuthorizationService', ['$http', 'SessionService', authService]);
})();