(function(){

    'use strict';

    module.exports = function(chartRepository){

        function errorThrown(res) {

            res.status(500).send('An error ocurred, please contact support. Thank you!');
        }

        return {
            getQuantity: function(req, res) {

                chartRepository.getQuantity().then(function(results){

                    res.send(results);
                }, function(){

                    errorThrown(res);
                });
            }
        }
    }

})();