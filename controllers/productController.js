(function() {

    'use strict';

    module.exports = {
        getAll: function(req, res) {
            req.getConnection(function(err, connection){

                connection.query('SELECT * FROM products', null, function(err, rows)
                {

                    if(err)
                        console.log("Error Selecting : %s ",err );

                    res.send(rows);
                });
            });
        }
    };
})();