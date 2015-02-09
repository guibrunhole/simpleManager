(function() {

    'use strict';

    module.exports = function(app, pool){

        var ProductRepository = require('./repository/productRepository')(pool);
        var ProductController = require('./controller/productController')(ProductRepository);

        var UserRepository = require('./repository/userRepository')(pool);
        var UserController = require('./controller/userController')(UserController);


        app.get('/product', ProductController.getAll);
        app.post('/product', ProductController.addNew);

        app.get('/product/:id', ProductController.getById);
        app.put('/product/:id', ProductController.update);
        app.delete('/product/:id', ProductController.remove);

        app.get('/user', UserController.getAll);
        app.post('/user', UserController.addNew);

        app.get('/user/:id', UserController.getById);
        app.put('/user/:id', UserController.update);
        app.delete('/user/:id', UserController.remove);
    }
})();