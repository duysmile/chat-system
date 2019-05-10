const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');   
const validate = require('express-validation');

exports.load = function(app) {
    // API create new user
    app.post('/api/v1/users', validate(userValidation.createUser()), userController.createUser);

    // API get list users
    app.get('/api/v1/users', userController.getListUsers);

    // API update user by id
    app.put('/api/v1/users/:id', validate(userValidation.updateUser()), userController.updateUser);

    // API get user by id
    app.get('/api/v1/users/:id', validate(userValidation.paramId()), userController.getUserById);

    // API delete user by id
    app.delete('/api/v1/users/:id', validate(userValidation.paramId()), userController.deleteUser);
};
