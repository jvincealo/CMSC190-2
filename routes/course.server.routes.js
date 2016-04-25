var courses = require('../controllers/course.server.controller.js');

module.exports = function(app) {
    app.route('/courses/bulk').get(courses.add);
};