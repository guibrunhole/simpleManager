/**
 * Created by asus on 23/04/2015.
 */
(function () {

    'use strict';

    function churchService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(page, searchParam) {

                var data = {
                    page: page,
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/church', {params: data});
            }
        };
    }

    angular.module('app.services').factory('ChurchService', ['$http', 'BASE_API_ADDRESS', churchService]);
})();