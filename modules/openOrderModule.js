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
            }
        };
    };
})();