(function () {

    'use strict';

    function productListController($scope, ProductService, $route, $modal) {

        $scope.setLocationTitle('Produtos');

        $scope.searchByParam = function(param) {

            ProductService.getAll(1, param).
                success(function(products) {

                    $scope.$broadcast('UPDATE_LIST', products);
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

        function fetchMoreProducts(nextPage) {

            ProductService.getAll(nextPage).
                success(function(moreProducts) {

                    if(moreProducts.length > 0) {

                        $scope.$broadcast('CONCAT_LIST', moreProducts);
                    }
                })
                .error(function(err) {

                    console.error(err);
                });
        }

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
            fetchMoreItems: fetchMoreProducts
        };
    }

    angular.module('app.controllers').controller('ProductListController', productListController);
})();