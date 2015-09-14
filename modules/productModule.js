(function() {

    'use strict';

    module.exports = function(productRepository) {

        return {
            getAll: function(req, res, next) {

                productRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    next(err);
                });
            },
            addNew: function(req, res, next) {

                productRepository.add(req.body).then(function(createdProductId) {

                    res.send('Product created with Id: ' + createdProductId);
                }, function(err) {

                    next(err);
                });
            },
            getById: function(req, res, next) {

                productRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('Product not found :(');
                    else
                        res.send(result[0]);
                }, function(err) {

                    next(err);
                });
            },
            update: function(req, res, next) {

                productRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Product not found :(');
                    } else {

                        productRepository.update(req.params.id, req.body).then(function () {

                            res.send('Product updated!');
                        }, function(err) {

                            next(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            },
            remove: function(req, res, next) {

                productRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Product not found :(');
                    } else {

                        productRepository.removeById(req.params.id).then(function() {

                            res.send('Product removed!');
                        }, function(err) {

                            next(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            }
        };
    };
})();