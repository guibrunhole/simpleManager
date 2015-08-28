(function() {

    'use strict';

    function alertService($rootScope, $timeout) {

        $rootScope.alerts = [];

        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };

        function addAlert(alert) {
            $rootScope.alerts.push(alert);
        }

        return {
            addWarning: function(errorMessage) {

                var alert = {
                    type: 'warning',
                    msg: errorMessage,
                    lockScreen: false
                };

                addAlert(alert);
            },
            addError: function(errorMessage) {

                var alert = {
                    type: 'danger',
                    msg: errorMessage,
                    lockScreen: false
                };

                addAlert(alert);
            },
            addSuccess: function(errorMessage) {

                var alert = {
                    type: 'success',
                    msg: errorMessage,
                    lockScreen: false
                };

                addAlert(alert);
            }
        }
    }

    angular.module('app.services').service('AlertService', ['$rootScope', '$timeout', alertService]);
})();