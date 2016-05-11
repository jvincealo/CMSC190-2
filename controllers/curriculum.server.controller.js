var Curriculum = require('mongoose').model('Curriculum')
var User = require('mongoose').model('User')

exports.createOrUpdate = function(req, res, next) {
    var code = req.body.code;
    Curriculum.update(
        {code: code},
        req.body,
        {
            upsert: true,
            setDefaults: true
        },
        function(err) {
            var message = "";
            if(err)
                message = err;
            else
                message = "Done!";

            res.json({message: message});
        }
    );
};

//show all curriculums
exports.list = function(req, res, next) {
    Curriculum.find({}, function(err, curriculums) {
        if(err)
            return next(err);
        else
            res.json(curriculums);
    });
};

exports.show = function(req, res) {
    Curriculum.find({
            author: req.params.curr_id
        },
        function(err, curriculums) {
            if (err) {
                   res.send(err);
            }
            else {
                res.json(curriculums);
            }
        }
    );
};

exports.read = function(req, res) {
    Curriculum.findById(req.params.curr_id)
    .lean()
    .exec(
        function(err, curriculum) {
            if (err) {
                   res.send(err);
            }
            else {
                res.json(curriculum);
            }
        }
    );
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
