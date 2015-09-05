(function () {

    'use strict';

    function userListController($scope, UserService, $route, $location, AlertService) {

        $scope.tableDef = {
            structure: [
                { header: 'Nome', cell: 'name', altCell: 'Sem nome'},
                { header: 'Login', cell: 'login', altCell: 'Sem login'},
                { header: 'E-mail', cell: 'email', altCell: 'Sem email'}
            ],
            actions: {
                edit: {
                    onClickFunction: editUser
                },
                remove: {
                    onClickFunction: removeUser
                }
            },
            items: []
        };

        $scope.searchByParam = function(param) {

            UserService.getAll(param).
                success(function(users) {

                    $scope.tableDef.items = angular.copy(users);
                });
        };

        $scope.newUser = function() {

            $location.url('/user/new');
        };

        function editUser(user) {

            $location.url('/user/edit/' + user.id);
        }

        function removeUser(user) {

            UserService.remove(user.id)
                .success(function() {

                    $route.reload();
                    AlertService.addSuccess("Usuario removido com sucesso!");
                });
        }

        function fetchUsers() {

            UserService.getAll().
                success(function(users) {

                    if(users && users.length > 0) {

                        $scope.tableDef.items = angular.copy(users);
                    }
                })
        }

        fetchUsers();
    }

    angular.module('app.controllers').controller('UserListController', userListController);
})();