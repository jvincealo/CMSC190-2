var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new LocalStrategy({
      usernameField : "username",
      passwordField : "password",
      passReqToCallback : true
    },
    function(req, username, password, done) {
      process.nextTick(function () {
          User.findOne({'local.username' : username}, function(err, user) {
            if(err)
              return done(err)
            else return done(null, user)

          })
        }
      );
    }
    ));
};