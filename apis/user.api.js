const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');   
const validate = require('express-validation');
const authenMiddleware = require('../middlewares/authentication.middleware');

exports.load = (app) => {
    // API create new user
    app.post('/api/v1/users', validate(userValidation.createUser()), userController.createUser);

    // API get list users
    app.get('/api/v1/users', authenMiddleware.verifyToken, userController.getListUsers);

    // API update user by id
    app.put('/api/v1/users/:id', [authenMiddleware.verifyToken, validate(userValidation.updateUser())], userController.updateUser);

    // API get user by id
    app.get('/api/v1/users/:id', [authenMiddleware.verifyToken, validate(userValidation.paramId())], userController.getUserById);

    // API delete user by id
    app.delete('/api/v1/users/:id', [authenMiddleware.verifyToken, validate(userValidation.paramId())], userController.deleteUser);

    // API forgot password
    app.post('/api/v1/users/forgot-password', validate(userValidation.forgotPassword()), userController.forgotPassword);

    // API reset password
    app.post('/api/v1/users/reset-password', validate(userValidation.resetPassword()), userController.resetPassword);
};
