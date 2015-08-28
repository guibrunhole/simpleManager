(function () {

    'use strict';

    function churchService($http, BASE_API_ADDRESS) {

        return {

            getAll: function(searchParam) {

                var data = {
                    searchParam: searchParam
                };

                return $http.get(BASE_API_ADDRESS + '/church', {params: data});
            },
            getById: function(churchId) {

                return $http.get(BASE_API_ADDRESS + '/church/' + churchId);
            },
            remove: function(churchId) {

                return $http.delete(BASE_API_ADDRESS + '/church/' + churchId);
            },
            add: function(newChurch) {

                return $http.post(BASE_API_ADDRESS + '/church', newChurch);
            },
            update: function(churchId, updatedChurch) {

                return $http.put(BASE_API_ADDRESS + '/church/' + churchId, updatedChurch);
            }
        };
    }

    angular.module('app.services').factory('ChurchService', ['$http', 'BASE_API_ADDRESS', churchService]);
})();