var config   = require('./config');
var mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    //load models
    require("../models/user.server.model.js");
    require("../models/course.server.model.js");
    require('../models/curriculum.server.model.js');
    require('../models/comment.server.model.js');

    return db
;}