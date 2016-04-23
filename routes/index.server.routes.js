var passport = require('passport'),
    mongoose = require('mongoose');

function isLoggedin(req, res, next) {
    if(req.isAuthenticated())
        return next;

    res.redirect('/index');
}


module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    app.get('/', isLoggedin, index.home);

    app.get('/index', index.entry);
    app.get('/new', index.create);

    app.get('/logout', index.logout);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/index'
            }));

}