var mongoose = require('mongoose');

module.exports = function(passport) {
    var User = mongoose.model('User');

    require('./strategies/local.js')();
    require('./strategies/google.js')();

    passport.serializeUser(function(user, done) {
        var sessionUser = {
            id : user.id,
            email : user.email,
            username: user.username
        }
        done(null, sessionUser);
        // done(null, user.id)
    });

    passport.deserializeUser(function(sessionUser, done) {
        done(null, sessionUser);
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // })
    });

};