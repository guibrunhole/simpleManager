(function () {

    'use strict';

    function productListController($scope, ProductService, $route, AlertService, $location) {

        $scope.setLocationTitle('Produtos');

        $scope.tableDef = {
            structure: [
                { header: 'Id no Fornecedor', cell: 'id_on_supplier', altCell: 'Sem nome'},
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
                });
        };

        $scope.newProduct = function() {

            $location.url('/product/new');
        };

        function editProduct(product) {

            $location.url('/product/edit/' + product.id);
        }

        function removeProduct(product) {

            ProductService.remove(product.id)
                .success(function() {

                    $route.reload();
                    AlertService.addSuccess("Produto removido com sucesso!");
                });
        }

        function fetchProducts() {

            ProductService.getAll().
                success(function(products) {

                    if(products && products.length > 0) {

                        $scope.tableDef.items = angular.copy(products);
                    }
                });
        }

        fetchProducts();
    }

    angular.module('app.controllers').controller('ProductListController', productListController);
})();