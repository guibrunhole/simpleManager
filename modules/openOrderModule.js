(function() {

    'use strict';

    var emailHelper = require('../helper/emailHelper')();
    var orderHelper = require('../helper/orderHelper')();

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
            },
            getAsPdf: function(req, res, next) {

                openOrderRepository.getForPdf(req.params.id).then(function(order) {

                    orderHelper.createPdf(order, true).then(function(pdfPath) {

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