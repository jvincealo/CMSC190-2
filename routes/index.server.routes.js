var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');

    app.get('/', index.entry);
    app.get('/new', index.create);
    app.get('/logout', index.logout);
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google',
            {
                successRedirect : '/',
                failureRedirect : '/'
            }
        )
    );
};
