var Comment = require('mongoose').model('Comment');
var User = require('mongoose').model('User');

exports.createOrUpdate = function(req, res) {
    var new_comment = new Comment(req.body);

    new_comment.save(function(err) {
        if(err)
            res.json(err)
        else
            res.json("Ok")
    });
};

exports.listByCurriculum = function(req, res) {
    var curr_id = req.params.curr_id;

    Comment.find( {
        type: 'curriculum',
        target: curr_id
    })
    .lean()
    .exec(
        function(err, comments) {
            res.json(comments);
        }
    );
};

exports.listByCourse = function(req, res) {
    var course_code = req.params.course_id;

    Comment.find( {
        type: 'course',
        target: course_code
    })
    .lean()
    .exec(
        function(err, comments) {
            res.json(comments);
        }
    );
};