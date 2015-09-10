(function() {

    'use strict';

    module.exports = function(openOrderRepository) {

        function errorThrown(err) {

            res.status(500).send(err || 'An error ocurred, please contact support. Thank you!');
        }

        return {

            getAll: function(req, res) {

                openOrderRepository.getAll(req.query.searchParam).then(function(results) {

                    res.send(results);
                }, function(err) {

                    errorThrown(err);
                });
            }
        };
    };
})();