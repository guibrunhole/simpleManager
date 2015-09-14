(function(){

    'use strict';

    module.exports = function(chartRepository){

        return {
            getQuantity: function(req, res, next) {

                chartRepository.getQuantity().then(function(results){

                    res.send(results);
                }, function(err){

                    next(err)
                });
            }
        }
    }

})();