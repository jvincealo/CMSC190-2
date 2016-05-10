var Course = require('mongoose').model('Course');
var User   = require('mongoose').model('User');
var Curriculum = require('mongoose').model('Curriculum');

exports.entry = function(req, res) {
    if(req.isAuthenticated()) {
        if((req.user.email)) {
            res.render('index', {
                title: 'Curriculum DB',
                message: req.flash("info", "Please login using your eUP account.")
            });
        }else {
             User.findById(req.user.id)
            .lean()
            .exec(function(err, user) {
                var ident;
                if(user.username)
                    ident = user.username
                else
                    ident = user.google.email

                var curriculumMap = {};

                Curriculum.find({
                    author: req.user.id
                    },
                    function(err, curriculums) {
                        var curr_map = [];
                        var current = {};
                        curriculums.forEach(function(curr) {
                            current.id = curr._id;
                            current.title = curr.title;
                            curr_map.push(current);
                        });
                        res.render('home', {
                            ident: ident,
                            curr_map: curr_map
                        });
                    }
                )
            });
        }
    } else {
        res.render('index', {
        title: 'Curriculum DB',
        message: ''
        });
    }
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

exports.create = function(req, res) {
    Course.find({})
    .sort([['code', 'ascending']])
    .lean()
    .exec(function(err, courses) {
        if(err)
            res.send(err)
        else {
            if(req.isAuthenticated()) {
                User.findById(req.user.id)
                .lean()
                .exec(function(err, user) {
                    var id = req.user.id;
                    var ident;
                    if(user.username)
                        ident = user.username
                    else
                        ident = user.google.email

                    res.render('canvas', {
                        ident: ident,
                        courses: courses,
                        user_id: id
                    });
                });
            } else {
                res.render('canvas', {
                        courses: courses,
                        ident: 'not logged in',
                        user_id: ''
                    });
            }
        }
    });
}

exports.list = function(req, res) {
    var curriculumMap = {};
    var ident = "not logged in";

    Curriculum.find({
        author: req.params.user_id
        },
        function(err, curriculums) {
            var curr_map = [];
            var current = {};
            curriculums.forEach(function(curr) {
                current.id = curr._id;
                current.title = curr.title;
                curr_map.push(current);
            });

            if(req.isAuthenticated()) {
                User.findById(req.user.id
                    , function(err, user) {
                    if(user.username)
                        ident = user.username
                    else
                        ident = user.google.email
                    res.render('home', {
                        ident: ident,
                        curr_map: curr_map
                    });
                });
            } else {
                res.render('home', {
                    ident: ident,
                    curr_map: curr_map
                });
            }
        }
    )
}

exports.logout = function(req, res) {
    if(req.isAuthenticated())
        req.logout();
    res.redirect('/');
}

exports.admin = function(req, res) {

    res.render('admin');
}