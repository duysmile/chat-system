const mongoose = require('mongoose');

module.exports = {
    mongoose,
    connectDB: function() {
        return mongoose.connect('mongodb://ur1hzptr8lpash8t00d1:pvr7emsXyBByjVtD6IgI@b3ie5yhakdturym-mongodb.services.clever-cloud.com:27017/b3ie5yhakdturym', { 
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
    // TODO: load all models
};
