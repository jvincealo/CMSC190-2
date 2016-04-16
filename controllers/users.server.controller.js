var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function(err) {
    var message = '';
    if(err.code) {
        switch(code) {
            case 11000:
            case 11001:
                message = "Username already exists.";
                break;
            default:
                message = "Oops. Something went wrong.";
        }
    } else {
        for(var errName in err.errors) {
            if(err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};

//create new users
exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if(err)
            return next(err);
        else
            res.json(user);
    });
};

//show all users
exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if(err)
            return next(err);
        else
            res.json(users);
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if (err) {
                return next(err);
            }
            else {
                req.user = user;
                next();
            }
        }
    );
};

//update user details
exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

//delete user
exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    })
};

exports.renderLogin = function(req, res, next) {
    if(!req.user) {
        res.render('index');
    } else {
        res.rediretct('/');
    }
};

exports.logout = function(req, res, next) {
    req.logout();
    req.redirect('/');
};
