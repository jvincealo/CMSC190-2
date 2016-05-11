var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function(app) {
    var index = require('../controllers/index.server.controller');

        // app.get('/admin', index.admin);
        // app.get('/', index.entry);
        // app.get('/new', index.create);
        // app.get('/logout', index.logout);
        // app.get('/:search_terms', index.list);
        // app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
        // app.get('/auth/google/callback',
        //     passport.authenticate('google',
        //         {
        //             successRedirect : '/',
        //             failureRedirect : '/'
        //         }
        //     )
        // );

    app.post('/new', index.load);

    app.route('/admin')
        .get(index.admin);

    app.route('/')
        .get(index.entry);

    app.route('/new')
        .get(index.create);

    app.route('/logout')
        .get(index.logout);

    app.route('/:search_terms')
        .get(index.list);

    app.route('/auth/google')
        .get( passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.route('/auth/google/callback')
        .get(
            passport.authenticate('google',
                {
                    successRedirect : '/',
                    failureRedirect : '/'
                }
            )
        );
};
