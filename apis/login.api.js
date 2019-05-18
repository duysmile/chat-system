const loginController = require('../controllers/login.controller');

exports.load = function(app) {
    app.post('/api/v1/login', loginController.login);
};
