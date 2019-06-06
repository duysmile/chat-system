const mongoose = require('mongoose');

module.exports = {
    mongoose,
    connectDB: function() {
        return mongoose.connect('mongodb://localhost:27017/node03', { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
    // TODO: load all models
};