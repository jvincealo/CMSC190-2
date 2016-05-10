var departments = require('../controllers/department.server.controller.js');

module.exports = function(app) {
    app.route('/departments')
        .post(departments.create);

    app.route('/departments/list')
        .get(departments.list);

    app.route('/department/:dept_id')
        .get(departments.read)
        .put(departments.update)
        .delete(departments.delete);
}