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
                        res.render('home', {
                            ident: ident,
                            curr_map: curriculums
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
                curriculum: "",
                user_id: id,
                code : ''
            });
        });
    } else {
        res.render('canvas', {
                ident: 'not logged in',
                curriculum: "",
                user_id: '',
                code : ''
            });
    }
}

exports.list = function(req, res) {
    var keyword = req.params.search_terms.replace("%20"," ");

    var curriculumMap = {};
    var ident = "not logged in";

    Curriculum.find({
        title: new RegExp(keyword, "i")
        },
        function(err, curriculums) {
            console.log(JSON.stringify(curriculums))
            if(req.isAuthenticated()) {
                User.findById(req.user.id
                    , function(err, user) {
                    if(user.username)
                        ident = user.username
                    else
                        ident = user.google.email
                    res.render('home', {
                        ident: ident,
                        curr_map: curriculums
                    });
                });
            } else {
                res.render('home', {
                    ident: ident,
                    curr_map: curriculums
                });
            }
        }
    )
}

exports.load = function(req, res) {
    Curriculum.findById(req.body.data.code)
        .exec(function(err, curriculum) {
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
                        code: curriculum._id,
                        user_id: id
                    });
                });
            } else {
                res.render('canvas', {
                        ident: 'not logged in',
                        code: curriculum._id,
                        user_id: ''
                    });
            }
        }
    );
}

exports.logout = function(req, res) {
    if(req.isAuthenticated())
        req.logout();
    res.redirect('/');
}

exports.admin = function(req, res) {

    res.render('admin');
}