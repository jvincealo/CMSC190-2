var Course = require('mongoose').model('Course');

exports.render = function(req, res) {
    res.render('index', {
        title: 'In Progress'
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