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
        },
        addNew: function(req, res) {

            req.getConnection(function(connectionError, connection) {

                if(connectionError)
                    res.status(500).send(connectionError);

                connection.query('INSERT INTO products (name, description, price) VALUES (?, ?, ?)', [req.body.name, req.body.description || null, req.body.price], function(queryError) {

                    if(queryError)
                        res.status(400).send(queryError);

                    res.send("Product added!");
                });
            });
        },
        getById: function(req, res) {

            req.getConnection(function(connectionError, connection) {

                if(connectionError)
                    res.status(500).send(connectionError);

                connection.query('SELECT * FROM products WHERE id = ?', [req.params.id], function(queryError, row) {

                    if(queryError)
                        res.status(400).send(queryError);

                    if(!row || row.length < 1) {
                        res.status(404).send('Product not found :(');
                        return;
                    }

                    res.send(row);
                });
            });
        },
        update: function(req, res) {

            req.getConnection(function(connectionError, connection) {

                if(connectionError)
                    res.status(500).send(connectionError);

                connection.query('SELECT * FROM products WHERE id = ?', [req.params.id], function(queryError, row) {

                    if(queryError)
                        res.status(400).send(queryError);

                    if(!row || row.length < 1) {
                        res.status(404).send('Product not found :(');
                        return;
                    }

                    connection.query('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
                        [req.body.name, req.body.description || null, req.body.price, req.params.id],
                        function(queryError) {

                            if(queryError)
                                res.status(400).send(queryError);

                            res.send("Product updated!");
                        });
                });
            });
        },
        remove: function(req, res) {

            req.getConnection(function(connectionError, connection) {

                if(connectionError)
                    res.status(500).send(connectionError);


                connection.query('SELECT * FROM products WHERE id = ?', [req.params.id], function(queryError, row) {

                    if (queryError)
                        res.status(400).send(queryError);

                    if (!row || row.length < 1) {
                        res.status(404).send('Product not found :(');
                        return;
                    }

                    connection.query('DELETE FROM products WHERE id = ?', [req.params.id], function(queryError, row) {

                        if(queryError)
                            res.status(400).send(queryError);

                        res.send("Product removed!");
                    });
                });
            });
        }
    };
})();