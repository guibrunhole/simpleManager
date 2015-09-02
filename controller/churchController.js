(function() {

    'use strict';

    module.exports = function(churchRepository) {

        function errorThrown(err) {

            console.error(err);
            res.status(500).send(err);
        }

        return {
            getAll: function(req, res) {

                churchRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    errorThrown(err);
                });
            },
            addNew: function(req, res) {

                churchRepository.add(req.body).then(function(createdChurchId) {

                    res.send('Church created with Id: ' + createdChurchId);
                }, function(err) {

                    errorThrown(err);
                });
            },
            getById: function(req, res) {

                churchRepository.getById(req.params.id).then(function(result) {

                    if(!result || !result[0] || result.length < 1)
                        res.status(404).send('Church not found :(');
                    else
                        res.send(result[0]);
                }, function(err) {

                    errorThrown(err);
                });
            },
            update: function(req, res) {

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

                    errorThrown(err);
                });
            },
            remove: function(req, res) {

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

                    errorThrown(err);
                });
            }
        };
    };
})();