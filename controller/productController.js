(function() {

    'use strict';

    module.exports = function(productReposiroty) {

        return {

            getAll: function(req, res) {

                productReposiroty.getAll().then(function(results) {

                    res.send(results);
                });
            },
            addNew: function(req, res) {

                productReposiroty.add(req.body).then(function(createdProductId) {

                    res.send('Product created with Id: ' + createdProductId);
                });
            },
            getById: function(req, res) {

                productReposiroty.getById(req.params.id).then(function(result) {

                    res.send(result);
                });
            },
            update: function(req, res) {

                productReposiroty.update(req.params.id, req.body).then(function() {

                    res.send('Product updated!');
                });
            },
            remove: function(req, res) {

                productReposiroty.removeById(req.params.id).then(function() {

                    res.send('Product removed!');
                });
            }
        };
    };
})();