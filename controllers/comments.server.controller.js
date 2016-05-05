var Comment = require('mongoose').model('Comment');
var User = require('mongoose').model('User');
var async = require('async');

var getById = function(id, callback) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if(!user.username) {
                console.log(user.google.email)
                return user.google.email

            } else {
                console.log(user.username);
                return user.username
            }
        }
    );
    callback();
}

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

    Comment.find({
        type: 'curriculum',
        target: curr_id
        },
        function(err, comments) {
            var comments_map = [];
            var current = {};

            comments.forEach(function(curr) {
                current.id = curr._id;
                current.text = curr.text;
                current.author = users.userById(curr.author)
                comments_map.push(current);
            });
            res.json(comments_map);
        }
    )
};

exports.listByCourse = function(req, res) {
    var course_id = req.params.course_id;

    Comment.find( {
        type: 'course',
        target: course_id
    })
    .lean()
    .exec(
        function(err, comments) {
            res.json(comments);
        }
    );
};