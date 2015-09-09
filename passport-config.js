(function() {

    'use strict';

    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require('bcrypt-nodejs');

    module.exports = function(passport, pool) {

        var UserRepository = require('./repository/userRepository')(pool);

        passport.serializeUser(function(user, done) {

            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            UserRepository.getById(id)
                .then(function(user) {

                    done(null, user);
                }, function(err) {

                    done(err);
                });
        });

        passport.use(new LocalStrategy(function (username, password, done) {

            UserRepository.getByUsername(username)
                .then(function(user) {

                    if (!user)
                        return done(null, false, { message: 'Incorrect username.' });

                    bcrypt.compare(password, user.password, function(err, res) {
                        if(err)
                            return done(err);

                        if(!res)
                            return done(null, false, { message: 'Incorrect password.' });

                        return done(null, user);
                    });

                }, function(err) {

                    return done(err);
                });
        }));
    };
})();