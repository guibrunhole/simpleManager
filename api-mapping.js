(function() {

    'use strict';

    module.exports = function(app, pool, passport){

        var ProductRepository = require('./repository/productRepository')(pool);
        var UserRepository = require('./repository/userRepository')(pool);
        var OrderRepository = require('./repository/orderRepository')(pool);
        var ChurchRepository = require('./repository/churchRepository')(pool);
        var ChartRepository = require('./repository/chartRepository')(pool);
        var OpenOrderRepository = require('./repository/openOrderRepository')(pool);

        var ProductModule = require('./modules/productModule')(ProductRepository);
        var UserModule = require('./modules/userModule')(UserRepository);
        var ChurchModule = require('./modules/churchModule')(ChurchRepository);
        var OrderModule = require('./modules/orderModule')(OrderRepository, ChurchRepository, UserRepository);
        var ChartModule = require('./modules/chartModule')(ChartRepository);
        var OpenOrderModule = require('./modules/openOrderModule')(OpenOrderRepository);

        app.post('/login', passport.authenticate('local'), function(req, res) {
            delete req.user.password;
            res.send(req.user);
        });

        app.get('/logout', function(req, res){
            req.logout();
            res.redirect('/');
        });

        app.get('/loggedIn', function(req, res) {

            if(req.isAuthenticated()) {
                delete req.user.password;
                res.send(req.user);
            } else {
                res.send('0');
            }
        });

        function ensureAuthenticated(req, res, next) {

            if (req.isAuthenticated()) { return next(); }
            req.session.error = 'Você precisa se logar primeiro ;)';
            res.redirect('/');
        }

        // Product
        app.get('/product', ensureAuthenticated, ProductModule.getAll);
        app.post('/product', ensureAuthenticated, ProductModule.addNew);
        app.get('/product/:id', ensureAuthenticated, ProductModule.getById);
        app.put('/product/:id', ensureAuthenticated, ProductModule.update);
        app.delete('/product/:id', ensureAuthenticated, ProductModule.remove);

        // User
        app.get('/user', ensureAuthenticated, UserModule.getAll);
        app.post('/user', ensureAuthenticated, UserModule.addNew);
        app.get('/user/:id', ensureAuthenticated, UserModule.getById);
        app.put('/user/:id', ensureAuthenticated, UserModule.update);
        app.delete('/user/:id', ensureAuthenticated, UserModule.remove);

        // Church
        app.get('/church', ensureAuthenticated, ChurchModule.getAll);
        app.post('/church', ensureAuthenticated, ChurchModule.addNew);
        app.get('/church/:id', ensureAuthenticated, ChurchModule.getById);
        app.put('/church/:id', ensureAuthenticated, ChurchModule.update);
        app.delete('/church/:id', ensureAuthenticated, ChurchModule.remove);

        // Order
        app.get('/order', ensureAuthenticated, OrderModule.getAll);
        app.post('/order', ensureAuthenticated, OrderModule.addNew);
        app.get('/order/:id', ensureAuthenticated, OrderModule.getById);
        app.put('/order/:id', ensureAuthenticated, OrderModule.update);
        app.delete('/order/:id', ensureAuthenticated, OrderModule.remove);
        app.get('/order/:id/pdf', ensureAuthenticated, OrderModule.getAsPdf);

        // Chart
        app.get('/chart', ensureAuthenticated, ChartModule.getQuantity);

        // Open Order
        app.get('/openOrder', ensureAuthenticated, OpenOrderModule.getAll);

        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res) {
            console.log('sup');
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }
})();