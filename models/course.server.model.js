var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var CourseSchema = new Schema({
    code: {
                    type: String,
                    unique: true
                },
    title: {
                    type: String,
                    unique: true
                },
    prerequisite: [{
                    type: String
                }],
    units:      Number,
    description: String,
    offered    : [{
                            type: String,
                            enum: ["First Semester", "Second Semester", "Midyear"]
                }]
});

mongoose.model('Course', CourseSchema);
