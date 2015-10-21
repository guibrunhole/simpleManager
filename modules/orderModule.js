(function() {

    'use strict';

    var emailHelper = require('../helper/emailHelper')();
    var orderHelper = require('../helper/orderHelper')();
    var q = require('q');

    module.exports = function(orderRepository) {

        return {
            getAll: function(req, res, next) {

                orderRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    next(err);
                });
            },
            addNew: function(req, res, next) {

                orderRepository.add(req.body).then(function(createdOrderId) {

                    res.send('Order created with Id: ' + createdOrderId);
                }, function(err) {

                    next(err);
                });
            },
            getById: function(req, res, next) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result)
                        res.status(404).send('Order not found :(');
                    else
                        res.send(result);
                }, function(err) {

                    next(err);
                });
            },
            update: function(req, res, next) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result) {

                        res.status(404).send('Order not found :(');
                    } else {

                        orderRepository.update(req.params.id, req.body).then(function () {

                            res.send('Order updated!');
                        }, function(err) {

                            next(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            },
            remove: function(req, res, next) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result) {

                        res.status(404).send('Order not found :(');
                    } else {

                        orderRepository.removeById(req.params.id)
                            .then(function() {

                                res.send('Order removed!');
                            }, function(err) {

                                next(err);
                            });
                    }
                }, function(err) {

                    next(err);
                });
            },
            getAsPdf: function(req, res, next) {

                orderRepository.getForPdf(req.params.id).then(function(order) {

                    orderHelper.createPdf(order, false).then(function(pdfPath) {

                        if(req.query.sendTo) {

                            emailHelper.sendDetailedOrder(req.query.sendTo, req.query.pdfName, pdfPath)
                                .then(function() {

                                    res.send(pdfPath);
                                }, function(err) {

                                    next(err);
                                });
                        } else {

                            res.send(pdfPath);
                        }
                    }, function(err) {

                        next(err);
                    });
                }, function(err) {

                    next(err);
                });
            }
        };
    };
})();