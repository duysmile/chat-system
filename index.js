const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const userRoute = require('./apis/user.api');
const productRoute = require('./apis/product.api');

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

    // load APIs
    userRoute.load(app);
    productRoute.load(app);

    // Error handling
    app.use(function (err, req, res, next) {
        console.error(JSON.stringify(err, null, 2));
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
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
