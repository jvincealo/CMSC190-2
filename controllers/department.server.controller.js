var Department = require('mongoose').model('Department');

//save new department to database
exports.create = function(req, res) {
    var new_department = new Department(req.body);

    new_department.save(function(err) {
        if(err)
            res.json(err)
        else
            res.json({message: "Department successfully created!"})
    });
};

//update department given its id
exports.update = function(req, res) {
    Department.findById(req.params.dept_id,
            function(err, department) {
                if(err)
                    res.json({message: err})

                department.code = req.body.code;
                department.college = req.body.college;
                department.name = req.body.name;

                department.save(
                        function(err, department) {
                            if(err)
                                res.json({message: err})
                            else
                                res.json({message: "Department successfully updated!"})
                        }
                    );
            }
        )
};

//list departments
exports.list = function(req, res) {
    Department.find({})
        .sort({name : 1})
        .lean()
        .exec(
                function(err, departments) {
                    if(err)
                        res.send({message: err});
                    else
                        res.json(departments);
                }
            );
};

//delete a department and all courses offered under it
exports.delete = function(req, res) {
    Department.remove(
            {
                _id: req.params.dept_id
            },
            function(err, department) {
                if(err)
                    res.json({message: err})
                else
                    res.json({message: "Department succesfully deleted"})
            }
        );
};

//gets single department by id
exports.read = function(req, res) {
    Department.findById(req.params.dept_id)
        .lean()
        .exec(
                function(err, department) {
                    if(err)
                        res.json({message: err})
                    else
                        res.json(department)
                }
            );
};