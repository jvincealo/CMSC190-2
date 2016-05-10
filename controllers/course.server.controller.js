var Course = require('mongoose').model('Course');

//save new department to database
exports.create = function(req, res) {
    var new_course = new Course(req.body);

    new_course.save(function(err) {
        if(err)
            res.json(err)
        else
            res.json({message: "Course successfully created!"})
    });
};

//update Course given its id
exports.update = function(req, res) {
    Course.findById(req.params.course_id,
            function(err, Course) {
                if(err)
                    res.json({message: err})

                Course.code = req.body.code;
                Course.department = req.body.department;
                Course.title = req.body.title;
                Course.term = req.body.term;
                Course.prerequisite = req.body.prerequisite;
                Course.corequisite = req.body.corequisite;
                Course.concurrent = req.body.concurrent;
                Course.conprereq  = req.body.conprereq;

                Course.save(
                        function(err, Course) {
                            if(err)
                                res.json({message: err})
                            else
                                res.json({message: "Course successfully updated!"})
                        }
                    );
            }
        )
};

//list departments
exports.list = function(req, res) {
    Course.find({})
        .lean()
        .exec(
                function(err, courses) {
                    if(err)
                        res.send({message: err});
                    else
                        res.json(courses);
                }
            );
};

//delete a department and all courses offered under it
exports.delete = function(req, res) {
    Course.remove(
            {
                _id: req.params.course_id
            },
            function(err, department) {
                if(err)
                    res.json({message: err})
                else
                    res.json({message: "Course succesfully deleted"})
            }
        );
};

//gets single department by id
exports.read = function(req, res) {
    Course.findById(req.params.course_id)
        .lean()
        .exec(
                function(err, course) {
                    if(err)
                        res.json({message: err})
                    else
                        res.json(course)
                }
            );
};

exports.bydept = function(req, res) {
    Course.find({
        department : req.params.dept_id
    })
        .lean()
        .exec(
                function(err, courses) {
                    if(err)
                        res.json({message: err})
                    else
                        res.json(courses)
                }
            );
};