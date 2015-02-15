(function() {

    'use strict';

    function loginService($http) {

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
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': ''
                    }
                });
            }
        };
    }

    angular.module('app.services').service('LoginService', ['$http', loginService]);
})();