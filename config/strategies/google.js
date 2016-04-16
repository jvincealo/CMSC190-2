var passport = require('passport'),
    url      = require('url'),
    GoogleStrategy = require('passport-google-oath').OAuth2Strategy,
    config   = require('../config'),
    users    = require('../../controllers/users.server.controller.js');

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID    : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL  : config.google.callbackURL,
        passReqToCallback: true
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({'google.id' : profile.id})
        })
    }
    ))
}