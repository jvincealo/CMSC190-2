var Curriculum = require('mongoose').model('Curriculum')

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

//show all users
exports.list = function(req, res, next) {
    Curriculum.find({}, function(err, curriculums) {
        if(err)
            return next(err);
        else
            res.json(curriculums);
    });
};

exports.curriculumByUser = function(req, res, next, id) {
    Curriculum.find({
            author: id
        },
        function(err, curriculums) {
            if (err) {
                return next(err);
            }
            else {
                res.json(curriculums);
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