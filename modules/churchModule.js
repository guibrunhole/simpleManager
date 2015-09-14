(function() {

    'use strict';

    module.exports = function(churchRepository) {

        return {
            getAll: function(req, res, next) {

                churchRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    next(err);
                });
            },
            addNew: function(req, res, next) {

                churchRepository.add(req.body).then(function(createdChurchId) {

                    res.send('Church created with Id: ' + createdChurchId);
                }, function(err) {

                    next(err);
                });
            },
            getById: function(req, res, next) {

                churchRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('Church not found :(');
                    else
                        res.send(result[0]);
                }, function(err) {

                    next(err);
                });
            },
            update: function(req, res, next) {

                churchRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Church not found :(');
                    } else {

                        churchRepository.update(req.params.id, req.body).then(function () {

                            res.send('Church updated!');
                        }, function (err) {

                            errorThrown(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            },
            remove: function(req, res, next) {

                churchRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('Church not found :(');
                    } else {

                        churchRepository.removeById(req.params.id).then(function() {

                            res.send('Church removed!');
                        }, function(err) {

                            errorThrown(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            }
        };
    };
})();