const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');

const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;

const userApis = require('./apis/user.api');
const productApis = require('./apis/product.api');
const roomApis = require('./apis/room.api');
const messageApis = require('./apis/message.api');
const loginApis = require('./apis/login.api');
const socketHandler = require('./socket-handler');

// const url = 'mongodb://localhost:27017';
// const dbName = 'node03';

const models = require('./models');
const port = 3001;

models.connectDB()
    .then(console.log('DB connected!'))
    .catch(e => {
        console.error(e);
        return process.exit(1);
    });

const headers = {
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': true
};

app.use(cors(headers));
app.options('*', cors(headers));

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

socketHandler.load(io);

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
