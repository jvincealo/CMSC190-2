var passport = require('passport');

exports.entry = function(req, res) {
    res.render('index', {
        title: 'Curriculum DB'
    });
};

exports.create = function(req, res) {
    res.render('canvas');
};

exports.render = function(req, res) {
    res.render('home');
};

exports.auth = function() {
    passport.authenticate('google', { scope : ['profile', 'email']});
};

exports.authCallback = function() {
    passport.authenticate('google', {
        successRedirect :  '/',
        failureRedirect :  '/index  '
    });
};

exports.home = function(req, res) {
    res.render('home');
}

exports.create = function(req, res) {
    Course.find({})
    .sort([['code', 'ascending']])
    .lean()
    .exec(function(err, courses) {
        if(err)
            res.send(err)
        else {
            res.render('canvas', {
                courses: courses
            });
        }
    });
}