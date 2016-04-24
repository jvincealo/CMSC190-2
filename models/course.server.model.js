var mongoose = require('mongoose');

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