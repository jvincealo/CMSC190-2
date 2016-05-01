var Course = require('mongoose').model('Course');
var User   = require('mongoose').model('User');

//retrieve logged in user identity
// function getIdentity(req, id) {
//     if(req.isAuthenticated()) {
//         User.findById(id)
//         .lean()
//         .exec(function(err, user) {
//             var ident;
//             if(user.username)
//                 ident = user.username
//             else
//                 ident = user.google.email

//             // console.log(ident);
//             return ident;
//         });
//     }
// };

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

                res.render('home', {
                    ident: ident
                });
            });
        }
    } else {
        res.render('index', {
        title: 'Curriculum DB',
        message: ''
        });
    }
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

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}