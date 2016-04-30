var passport = require('passport'),
    url      = require('url'),
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy,
    config   = require('../config'),
    users    = require('../../controllers/users.server.controller.js');

module.exports = function() {
   passport.use(new GoogleStrategy({
        clientID    : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL  : config.google.callbackURL
    },
    function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
                var domain = (profile.emails[0].value).split('@')[1];
                if(domain === "up.edu.ph") {
                    var providedData = {
                        id : profile.id,
                        accessToken : accessToken,
                        email : profile.emails[0].value
                    }
                    users.saveGmailAccount(req, providedData, done);
                } else {
                    return done(null, profile);
                }
            }
        );
    }
    ));
}