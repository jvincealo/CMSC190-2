var courses = require('../controllers/course.server.controller.js');

module.exports = function(app) {
    app.route('/courses')
        .post(courses.create);

    app.route('/courses/list')
        .get(courses.list);

    app.route('/courses/:course_id')
        .put(courses.update)
        .delete(courses.delete);

    app.route('/courses/find/:course_code')
        .get(courses.read)

    app.route('/courses/department/:dept_id')
        .get(courses.bydept);
}