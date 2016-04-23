var passport = require('passport'),
    url      = require('url'),
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy,
    config   = require('../config'),
    users    = require('../../controllers/users.server.controller.js');

module.exports = function() {
   passport.use(new GoogleStrategy({
        clientID    : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL  : config.google.callbackURL,
        passReqToCallback: true

    },
    function(req, accessToken, refreshToken, profile, done) {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        var providerUserProfile = {
            name: profile.name.givenName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'facebook',
            providerId: profile.id,
            providerData: providerData
        };

        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
    ));
}