const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const UserController = require('./controllers/user.controller');
const UserMiddleware = require('./middlewares/user.middleware');

const url = 'mongodb://localhost:27017';
const dbName = 'node03';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    
    console.log('Connect to server successfully!');
    const db = client.db(dbName);

    app.use(function(req, res, next) {
        req.db = db;
        next();
    });

    // API create new user
    app.post('/api/v1/users', UserMiddleware.validateInputForUser, UserController.createUser);

    // API get list users
    app.get('/api/v1/users', UserController.getListUsers);

    // API update user by id
    app.put('/api/v1/users/:id', UserMiddleware.validateInputForUser, UserController.updateUser);

    // API get user by id
    app.get('/api/v1/users/:id', UserController.getUserById);

    // API delete user by id
    app.delete('/api/v1/users/:id', UserController.deleteUser);

    // Error handling
    app.use(function (err, req, res, next) {
        console.error(err);
        return res.json({
            message: err.message
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
