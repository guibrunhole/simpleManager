(function() {

    'use strict';

    module.exports = function(productReposiroty) {

        function errorThrown(res) {

            console.error(res);
            res.status(500).send('An error ocurred, please contact support. Thank you!');
        }

        return {
            getAll: function(req, res) {

                productReposiroty.getAll().then(function(results) {

                    res.send(results);
                }, function() {

                    errorThrown(res);
                });
            },
            addNew: function(req, res) {

                productReposiroty.add(req.body).then(function(createdProductId) {

                    res.send('Product created with Id: ' + createdProductId);
                }, function() {

                    errorThrown(res);
                });
            },
            getById: function(req, res) {

                productReposiroty.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('Product not found :(');
                    else
                        res.send(result[0]);
                }, function() {

                    errorThrown(res);
                });
            },
            update: function(req, res) {

                productReposiroty.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Product not found :(');
                    } else {

                        productReposiroty.update(req.params.id, req.body).then(function () {

                            res.send('Product updated!');
                        }, function () {

                            errorThrown(res);
                        });
                    }
                }, function() {

                    errorThrown(res);
                });
            },
            remove: function(req, res) {

                productReposiroty.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Product not found :(');
                    } else {

                        productReposiroty.removeById(req.params.id).then(function() {

                            res.send('Product removed!');
                        }, function() {

                            errorThrown(res);
                        });
                    }
                }, function() {

                    errorThrown(res);
                });
            }
        };
    };
})();