var users = require('../controllers/users.server.controller.js');
var passport = require('passport'),
    mongoose = require('mongoose');

module.exports  = function(app) {
    app.route('/users').post(users.create)
                       .get(users.list);

    app.route('/users/:userId').get(users.userByID).put(users.update).delete(users.delete);

    app.route('/login')
        .post(function(req, res) {
            passport.authenticate('local', {
                    successRedirect : '/',
                    failureRedirect : '/'
                }
            )
        })
};