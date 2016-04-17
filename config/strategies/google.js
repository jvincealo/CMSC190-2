var passport = require('passport'),
    url      = require('url'),
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy,
    config   = require('../config'),
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID    : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL  : config.google.callbackURL,
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {

    }
  ));
}