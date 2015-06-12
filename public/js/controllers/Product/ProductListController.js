(function () {

    'use strict';

    function productListController($scope, ProductService, $route, $modal) {

        $scope.setLocationTitle('Produtos');

        $scope.tableDef = {
            structure: [
                { header: 'Nome', cell: 'name', altCell: 'Sem nome'},
                { header: 'Descrição', cell: 'description', altCell: 'Sem descrição'},
                { header: 'Preço', cell: 'price', altCell: 'Sem preço', type: 'currency'}
            ],
            actions: {
                edit: {
                    onClickFunction: editProduct
                },
                remove: {
                    onClickFunction: removeProduct
                }
            },
            items: []
        };

        $scope.searchByParam = function(param) {

            ProductService.getAll(param).
                success(function(products) {

                    $scope.tableDef.items = angular.copy(products);
                })
                .error(function(err) {

                    console.error(err);
                });
        };

        $scope.newProduct = function() {

            var modalInstance = $modal.open({
                templateUrl: '../templates/views/Product/productNew.html',
                backdropClass: 'full-height',
                controller: 'ProductNewController'
            });

            modalInstance.result.then(function() {

                $route.reload();
                console.log('Product saved like a boss!');
            });
        };

        function editProduct(product) {

            var modalInstance = $modal.open({
                templateUrl: '../templates/views/Product/productEdit.html',
                backdropClass: 'full-height',
                controller: 'ProductEditController',
                resolve: {
                    productId: function() {

                        return product.id;
                    }
                }
            });

            modalInstance.result.then(function() {

                $route.reload();
                console.log('Product updated like a champ!');
            });
        }

        function removeProduct(product) {

            ProductService.remove(product.id)
                .success(function() {

                    $route.reload();
                })
                .error(function(err) {

                    console.log(err);
                });
        }

        function fetchProducts() {

            ProductService.getAll().
                success(function(products) {

                    if(products && products.length > 0) {

                        $scope.tableDef.items = angular.copy(products);
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        }

        fetchProducts();
    }

    angular.module('app.controllers').controller('ProductListController', productListController);
})();