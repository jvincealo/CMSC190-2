var mongoose = require('mongoose');

module.exports = function(passport) {
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        var sessionUser = {
            id : user.id,
            email : user.email
        }
        done(null, sessionUser);
    });

    passport.deserializeUser(function(sessionUser, done) {
        done(null, sessionUser);
    });

    require('./strategies/local.js')();
    require('./strategies/google.js')();
};