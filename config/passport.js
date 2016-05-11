var mongoose = require('mongoose');

module.exports = function(passport) {
    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        console.log(JSON.stringify(user));
        var sessionUser = {
            id : user.id,
            email : user.email,
            username: user.username
        }
        done(null, sessionUser);
    });

    passport.deserializeUser(function(sessionUser, done) {
        done(null, sessionUser);
    });

    require('./strategies/local.js')();
    require('./strategies/google.js')();
};