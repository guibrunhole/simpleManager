(function() {

    'use strict';

    function loginService($http, BASE_API_ADDRESS) {

        return {
            attemptLogin: function(credentials) {

                return $http.post(BASE_API_ADDRESS + '/login', credentials);
            },
            verifyLogin: function() {

                return $http.get(BASE_API_ADDRESS + '/loggedIn');
            },
            logout: function() {

                return $http.get(BASE_API_ADDRESS + '/logout');
            }
        };
    }

    angular.module('app.services').service('LoginService', ['$http', 'BASE_API_ADDRESS', loginService]);
})();