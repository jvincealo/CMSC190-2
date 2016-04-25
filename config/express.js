var express = require('express');

module.exports = function() {
    var app = express();

    //configurations
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');

    //routes
    require('../routes/index.server.routes.js')(app);
    require('../routes/course.server.routes.js')(app);

    //use static files
    app.use(express.static('./public'));
    return app;
}