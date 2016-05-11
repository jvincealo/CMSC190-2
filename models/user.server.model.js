var mongoose     = require('mongoose'),
    crypto       = require('crypto'),
    Schema       = mongoose.Schema;

var UserSchema = new Schema({
    local : {
        username: {
                type: String,
                trim: true,
                unique: true,
                sparse: true
        },
        password: String,
    },
    google : {
        id : String,
        token : String,
        email : {
                type: String,
                trim: true,
                unique: true,
                sparse: true
            }
    },
    admin : Boolean
});

UserSchema.pre('save', function(next) {
    if(this.local.password) {
        var md5 = crypto.createHash('md5');
        this.local.password = md5.update(this.local.password).digest('hex');
    }
    next();
});

UserSchema.methods.authenticate  = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.local.password === md5;
};

module.exports = mongoose.model('User', UserSchema);