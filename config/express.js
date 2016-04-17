var express = require('express');
var passport = require('passport');

module.exports = function() {
    var app = express();

    //configurations
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');

    app.use(passport.initialize());
    app.use(passport.session());
    //routes
    require('../routes/index.server.routes.js')(app);
    require('../routes/course.server.routes.js')(app);
    require('../routes/users.server.routes.js')(app);


    require('./passport.js')(passport);
    //use static files
    app.use(express.static('./public'));
    return app;
}