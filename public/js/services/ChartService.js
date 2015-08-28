/**
 * Created by asus on 26/06/2015.
 */
(function (){

    'use strict';

    function chartService($http, BASE_API_ADDRESS) {

        return {

            getQuantity: function (){

                return $http.get(BASE_API_ADDRESS + '/chart');

            }
        }
    }

    angular.module('app.services').factory('ChartService', ['$http', 'BASE_API_ADDRESS', chartService]);

})();
