(function() {

    'use strict';

    var express = require('express');
    var path = require('path');
    var bodyParser = require('body-parser');
    var cors = require('cors');

    var mysql = require('mysql');
    var pool  = mysql.createPool({
        connectionLimit : 30,
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'app',
        password : process.env.DB_PASS || '',
        port : process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'church_manager',
        multipleStatements: true
    });

    var app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/', express.static(__dirname + '/public'));
    app.use('/temp', express.static(__dirname + '/temp'));

    require('./api-mapping')(app, pool);

    var server = app.listen(process.env.SV_PORT || 3010, function () {

        console.log('I\'m running here bro %s! Go check me out ;)', server.address().port);
    });
})();
