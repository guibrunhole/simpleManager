(function() {

    'use strict';

    function errorInterceptor($q, AlertService) {

        return {
            requestError: function(rejection) {

                AlertService.addError('Ocorreu um erro!');
                return $q.reject(rejection);
            },
            responseError: function(rejection) {

                AlertService.addError(rejection.data);
                return $q.reject(rejection);
            }
        };
    }

    angular.module('app.services').factory('ErrorInterceptor', ['$q', 'AlertService', errorInterceptor]);
})();