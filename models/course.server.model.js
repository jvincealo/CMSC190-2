var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var CourseSchema = new Schema({
    code: {
                    type: String,
                    unique: true
            },
    department: String,
    units: Number,
    title: String,
    term : String,
    prerequisite: String,
    corequisite: {
                    type: String,
                    default: ""
                },
    concurrent : {
                    type: String,
                    default: ""
                },
    conprereq: {
                    type: String,
                    default: ""
                }
});
mongoose.model('Course', CourseSchema);
