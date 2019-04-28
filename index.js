const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

const UserController = require('./controllers/user.controller');
const UserMiddleware = require('./middlewares/user.middleware');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

// API create new user
app.post('/api/v1/users', UserMiddleware.validateCreateUser, UserController.createUser);

// API get list users
app.get('/api/v1/users', UserController.getListUsers);

// API update user by id
app.put('/api/v1/users/:id', UserMiddleware.validateUpdateUser, UserController.updateUser);

// API get user by id
app.get('/api/v1/users/:id', UserMiddleware.validateGetUserById, UserController.getUserById);

// API delete user by id
app.delete('/api/v1/users/:id', UserMiddleware.validateDeleteUserById, UserController.deleteUser);

// Error handling
app.use(function (err, req, res, next) {
    const errorMessage = err.message;
    console.error(errorMessage);
    return res.json({
        message: errorMessage
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));