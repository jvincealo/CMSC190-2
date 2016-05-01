var curriculum = require('../controllers/curriculum.server.controller.js');

module.exports = function(app) {
    app.route('/curriculum')
        .post(curriculum.createOrUpdate)
        .get(curriculum.list);
}