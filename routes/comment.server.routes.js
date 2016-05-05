var comments = require('../controllers/comments.server.controller.js');

module.exports = function(app) {
    app.route('/comments')
        .post(comments.createOrUpdate);

    app.route('/comments/curriculum/:curr_id')
        .get(comments.listByCurriculum);

    app.route('/comments/course/:course_id')
        .get(comments.listByCourse);
};