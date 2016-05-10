var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var DepartmentSchema = new Schema({
    code: {
                type : String,
                unique: true
            },
    college: String,
    name: String
});

mongoose.model('Department', DepartmentSchema);