var config  = require('../config/config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport   = require('passport'),
    flash      = require('flash'),
    cookieParser= require('cookie-parser'),
    morgan      = require('morgan'),
    session     = require('express-session');

module.exports = function() {
    var app = express();

    //configurations
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');


    app.use(morgan('dev'));
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({
        extended : true
    }));
    app.use(bodyParser.json());

    app.use(session({
        saveUninitialized : true,
        resave : true,
        secret : 'curriculumdbsecret',
        cookie : {maxAge :  60000}
    }));

    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    require('./passport.js')(passport);

    //routes
    require('../routes/index.server.routes.js')(app);
    require('../routes/course.server.routes.js')(app);
    require('../routes/users.server.routes.js')(app);

    //use static files
    app.use(express.static('./public'));
    return app;
}