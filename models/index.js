const mongoose = require('mongoose');

module.exports = {
    mongoose,
    connectDB: function() {
        return mongoose.connect(process.env.DB_CONNECTION_STR, { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
    // TODO: load all models
};
