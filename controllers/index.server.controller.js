var Course = require('mongoose').model('Course');

exports.entry = function(req, res) {
    if(req.isAuthenticated())
        if((req.user.email)) {
            res.render('index', {
                title: 'Curriculum DB',
                message: req.flash("info", "Please login using your eUP account.")
            });
        }else
            res.render('home')
    else {
        res.render('index', {
        title: 'Curriculum DB',
        message: ''
        });
    }
};

exports.create = function(req, res) {
    res.render('canvas');
};

exports.home = function(req, res) {
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

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}