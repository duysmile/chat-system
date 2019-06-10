const loginController = require('../controllers/login.controller');

exports.load = (app) => {
    app.post('/api/v1/login', loginController.login);
    app.post('/api/v1/login/facebook', loginController.loginByFB);
};
