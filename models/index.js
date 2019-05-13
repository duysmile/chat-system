const mongoose = require('mongoose');

module.exports = {
    mongoose,
    connectDB: () => {
        return mongoose.connect('mongodb://localhost:27017/node03', { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
};