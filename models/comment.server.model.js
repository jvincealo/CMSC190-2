var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var CommentSchema = new Schema({
    text : {
            type: String
        },
    author: String,
    added: {
            type: Date,
            Default: Date.now()
        },
    target: String,
    type : String
});

CommentSchema.pre('save', function(next) {
    this.added = Date.now();
    next();
});

mongoose.model('Comment',CommentSchema);