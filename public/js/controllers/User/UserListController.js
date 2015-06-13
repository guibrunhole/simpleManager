(function () {

    'use strict';

    function userListController($scope, UserService, $route, $modal) {

        $scope.setLocationTitle('Usuários');

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
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.newUser = function() {

            var modalInstance = $modal.open({
                templateUrl: '../templates/views/User/userNew.html',
                backdropClass: 'full-height',
                controller: 'UserNewController'
            });

            modalInstance.result.then(function() {

                $route.reload();
                console.log('User saved like a boss!');
            });
        };

        function editUser(user) {

            var modalInstance = $modal.open({
                templateUrl: '../templates/views/User/userEdit.html',
                backdropClass: 'full-height',
                controller: 'UserEditController',
                resolve: {
                    userId: function() {

                        return user.id;
                    }
                }
            });

            modalInstance.result.then(function() {

                $route.reload();
                console.log('User updated like a champ!');
            });
        }

        function removeUser(user) {

            UserService.remove(user.id)
                .success(function() {

                    $route.reload();
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        function fetchUsers() {

            UserService.getAll().
                success(function(users) {

                    if(users && users.length > 0) {

                        $scope.tableDef.items = angular.copy(users);
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        }

        fetchUsers();
    }

    angular.module('app.controllers').controller('UserListController', userListController);
})();