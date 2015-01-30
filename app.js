(function() {

    'use strict';

    var express = require('express');
    var connection  = require('express-myconnection');
    var mysql = require('mysql');
    var path = require('path');

    var productController = require('./controllers/productController.js');

    var app = express();
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(connection(mysql, {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'app',
            password : process.env.DB_PASS || '',
            port : process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'church_manager'
    }, 'request'));

    app.get('/product', productController.getAll);

    var server = app.listen(process.env.SV_PORT || 3010, function () {

        console.log('I\'m running here bro %s! Go check me out ;)', server.address().port);
    });
})();
