(function() {

    'use strict';

    var oauthserver = require('node-oauth2-server');

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var UserRepository = require('./repository/userRepository')(pool);
        var OrderRepository = require('./repository/orderRepository')(pool);
        var ChurchRepository = require('./repository/churchRepository')(pool);

        var ProductController = require('./controller/productController')(ProductRepository);
        var UserController = require('./controller/userController')(UserRepository);
        var ChurchController = require('./controller/churchController')(ChurchRepository);
        var OrderController = require('./controller/orderController')(OrderRepository, ChurchRepository, UserRepository);

        app.oauth = oauthserver({
            model: UserRepository,
            grants: ['password', 'refresh_token']
        });

        app.all('/oauth/token', app.oauth.grant());

        // Product
        app.get('/product', app.oauth.authorise(), ProductController.getAll);
        app.post('/product', app.oauth.authorise(), ProductController.addNew);
        app.get('/product/:id', app.oauth.authorise(), ProductController.getById);
        app.put('/product/:id', app.oauth.authorise(), ProductController.update);
        app.delete('/product/:id', app.oauth.authorise(), ProductController.remove);

        // User
        app.get('/user', app.oauth.authorise(), UserController.getAll);
        app.post('/user', app.oauth.authorise(), UserController.addNew);
        app.get('/user/:id', app.oauth.authorise(), UserController.getById);
        app.put('/user/:id', app.oauth.authorise(), UserController.update);
        app.delete('/user/:id', app.oauth.authorise(), UserController.remove);

        // Church
        app.get('/church', app.oauth.authorise(), ChurchController.getAll);
        app.post('/church', app.oauth.authorise(), ChurchController.addNew);
        app.get('/church/:id', app.oauth.authorise(), ChurchController.getById);
        app.put('/church/:id', app.oauth.authorise(), ChurchController.update);
        app.delete('/church/:id', app.oauth.authorise(), ChurchController.remove);

        // Order
        app.get('/order', app.oauth.authorise(), OrderController.getAll);
        app.post('/order', app.oauth.authorise(), OrderController.addNew);
        app.get('/order/:id', app.oauth.authorise(), OrderController.getById);
        app.put('/order/:id', app.oauth.authorise(), OrderController.update);
        app.get('/order/:id/detailed', app.oauth.authorise(), OrderController.getDetailedOrder);

        app.use(app.oauth.errorHandler());
    }
})();