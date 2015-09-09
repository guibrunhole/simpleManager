(function() {

    'use strict';

    var emailHelper = require('../helper/emailHelper')();
    var orderHelper = require('../helper/orderHelper')();
    var q = require('q');

    module.exports = function(orderRepository, churchRepository, userRepository) {

        function errorThrown(err) {

            res.status(500).send(err || 'An error ocurred, please contact support. Thank you!');
        }

        return {
            getAll: function(req, res) {

                orderRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function() {

                    errorThrown(res);
                });
            },
            addNew: function(req, res) {

                orderRepository.add(req.body).then(function(createdOrderId) {

                    res.send('Order created with Id: ' + createdOrderId);
                }, function() {

                    errorThrown(res);
                });
            },
            getById: function(req, res) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result)
                        res.status(404).send('Order not found :(');
                    else
                        res.send(result);
                }, function(err) {

                    errorThrown(err);
                });
            },
            update: function(req, res) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result) {

                        res.status(404).send('Order not found :(');
                    } else {

                        orderRepository.update(req.params.id, req.body).then(function () {

                            res.send('Order updated!');
                        }, function (err) {

                            errorThrown(err);
                        });
                    }
                }, function() {

                    errorThrown(res);
                });
            },
            remove: function(req, res) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result) {

                        res.status(404).send('Order not found :(');
                    } else {

                        orderRepository.removeById(req.params.id)
                            .then(function() {

                                res.send('Order removed!');
                            }, function(err) {

                                errorThrown(err);
                            });
                    }
                }, function() {

                    errorThrown(res);
                });
            },
            getAsPdf: function(req, res) {

                orderRepository.getForPdf(req.params.id).then(function(order) {

                    console.log("Order fetched!");
                    orderHelper.createPdf(order).then(function(pdfPath) {

                        if(req.query.sendTo)
                            emailHelper.sendDetailedOrder(req.query.sendTo, req.query.pdfName, pdfPath);

                        res.send(pdfPath);
                    }, function() {

                        errorThrown(res);
                    });
                });
            }
        };
    };
})();