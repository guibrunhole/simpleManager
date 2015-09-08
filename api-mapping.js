(function() {

    'use strict';

    var oauthserver = require('node-oauth2-server');

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var UserRepository = require('./repository/userRepository')(pool);
        var OrderRepository = require('./repository/orderRepository')(pool);
        var ChurchRepository = require('./repository/churchRepository')(pool);
        var ChartRepository = require('./repository/chartRepository')(pool);

        var ProductModule = require('./modules/productModule')(ProductRepository);
        var UserModule = require('./modules/userModule')(UserRepository);
        var ChurchModule = require('./modules/churchModule')(ChurchRepository);
        var OrderModule = require('./modules/orderModule')(OrderRepository, ChurchRepository, UserRepository);
        var ChartModule = require('./modules/chartModule')(ChartRepository);

        app.oauth = oauthserver({
            model: UserRepository,
            grants: ['password', 'refresh_token']
        });

        app.all('/oauth/token', app.oauth.grant());

        // Product
        app.get('/product', app.oauth.authorise(), ProductModule.getAll);
        app.post('/product', app.oauth.authorise(), ProductModule.addNew);
        app.get('/product/:id', app.oauth.authorise(), ProductModule.getById);
        app.put('/product/:id', app.oauth.authorise(), ProductModule.update);
        app.delete('/product/:id', app.oauth.authorise(), ProductModule.remove);

        // User
        app.get('/user', app.oauth.authorise(), UserModule.getAll);
        app.post('/user', app.oauth.authorise(), UserModule.addNew);
        app.get('/user/:id', app.oauth.authorise(), UserModule.getById);
        app.put('/user/:id', app.oauth.authorise(), UserModule.update);
        app.delete('/user/:id', app.oauth.authorise(), UserModule.remove);

        // Church
        app.get('/church', app.oauth.authorise(), ChurchModule.getAll);
        app.post('/church', app.oauth.authorise(), ChurchModule.addNew);
        app.get('/church/:id', app.oauth.authorise(), ChurchModule.getById);
        app.put('/church/:id', app.oauth.authorise(), ChurchModule.update);
        app.delete('/church/:id', app.oauth.authorise(), ChurchModule.remove);

        // Order
        app.get('/order', app.oauth.authorise(), OrderModule.getAll);
        app.post('/order', app.oauth.authorise(), OrderModule.addNew);
        app.get('/order/:id', app.oauth.authorise(), OrderModule.getById);
        app.put('/order/:id', app.oauth.authorise(), OrderModule.update);
        app.delete('/order/:id', app.oauth.authorise(), OrderModule.remove);
        app.get('/order/:id/pdf', app.oauth.authorise(), OrderModule.getAsPdf);

        // Chart
        app.get('/chart', app.oauth.authorise(), ChartModule.getQuantity);

        app.use(app.oauth.errorHandler());
    }
})();