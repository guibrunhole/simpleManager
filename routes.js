(function() {

    'use strict';

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var ProductController = require('./controller/productController')(ProductRepository);

        app.get('/product', ProductController.getAll);
        app.post('/product', ProductController.addNew);

        app.get('/product/:id', ProductController.getById);
        app.put('/product/:id', ProductController.update);
        app.delete('/product/:id', ProductController.remove);
    }
})();