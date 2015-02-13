(function() {

    'use strict';

    var emailHelper = require('../helper/emailHelper')();
    var orderHelper = require('../helper/orderHelper')();
    var q = require('q');

    module.exports = function(orderRepository, churchRepository, userRepository) {

        function errorThrown(res) {

            console.error(res);
            res.status(500).send('An error ocurred, please contact support. Thank you!');
        }

        return {
            getAll: function(req, res) {

                orderRepository.getAll().then(function(results) {

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

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('Order not found :(');
                    else
                        res.send(result[0]);
                }, function() {

                    errorThrown(res);
                });
            },
            update: function(req, res) {

                orderRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Order not found :(');
                    } else {

                        orderRepository.update(req.params.id, req.body).then(function () {

                            res.send('Order updated!');
                        }, function () {

                            errorThrown(res);
                        });
                    }
                }, function() {

                    errorThrown(res);
                });
            },
            getDetailedOrder: function(req, res) {

                var orderDeferred = q.defer();
                var churchDeferred = q.defer();
                var userDeferred = q.defer();

                orderRepository.getById(req.params.id).then(function(orderResult) {

                    var order = orderResult[0];
                    if(!order) {

                        orderDeferred.reject();
                        res.status(404).send('Order not found :(');
                    } else {

                        orderDeferred.resolve(order);

                        console.log(order);

                        userRepository.getById(order.user_id).then(function(userResult) {

                            console.log('User Result : ' + userResult);
                            userDeferred.resolve(userResult[0]);
                        });

                        churchRepository.getById(order.church_id).then(function(churchResult) {

                            churchDeferred.resolve(churchResult[0]);
                        });
                    }
                });

                q.spread([orderDeferred.promise, churchDeferred.promise, userDeferred.promise], function(order, church, buyer) {

                    orderHelper.createPdf(order, church, buyer).then(function(pdfPath) {

                        if(req.query.sendTo)
                            emailHelper.sendDetailedOrder(req.query.sendTo, pdfPath);

                        res.download(pdfPath, 'Pedido.pdf');
                    }, function() {

                        errorThrown(res);
                    });
                });
            }
        };
    };
})();