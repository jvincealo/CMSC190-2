var users = require('../controllers/users.server.controller.js');

module.exports  = function(app) {
    app.route('/users').post(users.create)
                       .get(users.list);

    app.route('/users/:userId').get(users.userByID).put(users.update).delete(users.delete);
};