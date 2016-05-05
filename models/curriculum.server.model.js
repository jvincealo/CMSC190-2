var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var CurriculumSchema = new Schema({
    author : {
                type: String,
                default: ""
            },
    csv: {
            type: String,
            default: ""
         },
    code: {
            type: String,
            trim: true,
            sparse: true,
            default: ""
        },
    department: {
            type: String,
            default: ""
        },
    title: {
            type: String,
            default: "New Curriculum"
        },
    created: {
            type: Date,
            default: Date.now
        },
    updated: {
            type: Date,
            default: Date.now
        }
});

mongoose.model('Curriculum', CurriculumSchema);