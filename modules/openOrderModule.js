(function() {

    'use strict';

    module.exports = function(openOrderRepository) {

        return {

            getAll: function(req, res, next) {

                openOrderRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    next(err);
                });
            },
            addNew: function(req, res, next) {

                openOrderRepository.add(req.body).then(function(createdOrderId) {

                    res.send('Open Order created with Id: ' + createdOrderId);
                }, function(err) {

                    next(err);
                });
            },
            remove: function(req, res, next) {

                openOrderRepository.getById(req.params.id).then(function(result) {

                    if(!result) {

                        res.status(404).send('Open order not found :(');
                    } else {

                        openOrderRepository.removeById(req.params.id)
                            .then(function() {

                                res.send('Open order removed!');
                            }, function(err) {

                                next(err);
                            });
                    }
                }, function(err) {

                    next(err);
                });
            },
            getById: function(req, res, next) {

                openOrderRepository.getById(req.params.id).then(function(result) {

                    if(!result)
                        res.status(404).send('Open order not found :(');
                    else
                        res.send(result);
                }, function(err) {

                    next(err);
                });
            }
        };
    };
})();