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
            unique: true,
            default: ""
        },
    department: {
            type: String,
            default: ""
        },
    title: {
            type: String,
            default: "New Curriculum"
        }
});

mongoose.model('Curriculum', CurriculumSchema);