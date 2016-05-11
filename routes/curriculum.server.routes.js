var curriculum = require('../controllers/curriculum.server.controller.js');

module.exports = function(app) {
    app.route('/curriculum')
        .post(curriculum.createOrUpdate)
        .get(curriculum.list);

    app.route('/curriculum/:curr_id')
        .get(curriculum.show);

    app.route('/curriculum/list/:curr_id')
        .get(curriculum.read);
}