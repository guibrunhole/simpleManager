(function() {

    'use strict';

    module.exports = function(userRepository) {

        return {
            getAll: function(req, res, next) {

                userRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    next(err);
                });
            },
            addNew: function(req, res, next) {

                userRepository.add(req.body).then(function(createdUserId) {

                    res.send('User created with Id: ' + createdUserId);
                }, function(err) {

                    next(err);
                });
            },
            getById: function(req, res, next) {

                userRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('User not found :(');
                    else
                        res.send(result[0]);
                }, function(err) {

                    next(err);
                });
            },
            update: function(req, res, next) {

                userRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('User not found :(');
                    } else {

                        userRepository.update(req.params.id, req.body).then(function () {

                            res.send('User updated!');
                        }, function(err) {

                            next(err);
                        });
                    }
                }, function(err) {

                    next(err);
                });
            },
            remove: function(req, res, next) {

                userRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1) {

                        res.status(404).send('User not found :(');
                    } else {

                        userRepository.removeById(req.params.id).then(function() {

                            res.send('User removed!');
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