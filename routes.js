(function() {

    'use strict';

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var UserRepository = require('./repository/userRepository')(pool);
        var OrderRepository = require('./repository/orderRepository')(pool);
        var ChurchRepository = require('./repository/churchRepository')(pool);

        var ProductController = require('./controller/productController')(ProductRepository);
        var UserController = require('./controller/userController')(UserRepository);
        var ChurchController = require('./controller/churchController')(ChurchRepository);
        var OrderController = require('./controller/orderController')(OrderRepository, ChurchRepository, UserRepository);

        // Product
        app.get('/product', ProductController.getAll);
        app.post('/product', ProductController.addNew);
        app.get('/product/:id', ProductController.getById);
        app.put('/product/:id', ProductController.update);
        app.delete('/product/:id', ProductController.remove);

        // User
        app.get('/user', UserController.getAll);
        app.post('/user', UserController.addNew);
        app.get('/user/:id', UserController.getById);
        app.put('/user/:id', UserController.update);
        app.delete('/user/:id', UserController.remove);

        // Church
        app.get('/church', ChurchController.getAll);
        app.post('./church', ChurchController.addNew);
        app.get('/church/:id', ChurchController.getById);
        app.put('/church/:id', ChurchController.update);
        app.delete('./church/:id', ChurchController.remove);

        // Order
        app.get('/order', OrderController.getAll);
        app.post('/order', OrderController.addNew);
        app.get('/order/:id', OrderController.getById);
        app.put('/order/:id', OrderController.update);
        app.get('/order/:id/detailed', OrderController.getDetailedOrder);
    }
})();