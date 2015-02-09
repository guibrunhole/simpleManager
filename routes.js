(function() {

    'use strict';

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var ProductController = require('./controller/productController')(ProductRepository);

        var OrderRepository = require('./repository/orderRepository')(pool);
        var OrderController = require('./controller/orderController')(OrderRepository);

        app.get('/product', ProductController.getAll);
        app.post('/product', ProductController.addNew);

        app.get('/product/:id', ProductController.getById);
        app.put('/product/:id', ProductController.update);
        app.delete('/product/:id', ProductController.remove);

        app.get('/order', OrderController.getAll);
        app.post('/order', OrderController.addNew);

        app.get('/order/:id', OrderController.getById);
        app.put('/order/:id', OrderController.update);
    }
})();