const express = require('express');
const app = express();
const port = 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);

const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;

const userApis = require('./apis/user.api');
const productApis = require('./apis/product.api');
const roomApis = require('./apis/room.api');
const messageApis = require('./apis/message.api');
const loginApis = require('./apis/login.api');

// const url = 'mongodb://localhost:27017';
// const dbName = 'node03';

const models = require('./models');
models.connectDB()
    .then(console.log('DB connected!'))
    .catch(e => {
        console.error(e);
        return process.exit(1);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

// load static file
app.use(express.static('public'));

// load APIs
userApis.load(app);
loginApis.load(app);
productApis.load(app);
roomApis.load(app);
messageApis.load(app);

// Error handling
app.use(function (err, req, res, next) {
    // console.error(JSON.stringify(err, null, 2));
    console.error(err);
    
    if (Array.isArray(err.errors)) {
        const messages = err.errors.map(function(item) {
            return item.messages;
        });
        return res.status(400).json({
            errors: messages
        });
    }
    return res.status(400).json({
        message: err.message
    });
});

io.on('connection', function(socket) {
    console.log('A user is connected.');
    
    socket.on('receiving-message', function(data, callback) {
        try {
            socket.broadcast.emit('send-message', data.message);
            return callback(null, data);            
        } catch (error) {
            return callback(error);
        }
    });

    socket.on('send-typing', function(data, callback) {
        try {
            socket.broadcast.emit('receive-typing');
            return callback(null, data);
        } catch (error) {
            return callback(error);
        }
    });

    socket.on('send-done-typing', function(data, callback) {
        try {
            socket.broadcast.emit('receive-done-typing');
            return callback(null, data);
        } catch (error) {
            return callback(error);
        }
    });
    
    socket.on('disconnect', function() {
        console.log('A user is disconnect.');
    })
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
