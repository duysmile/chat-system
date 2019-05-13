const { mongoose } = require('./index');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 100,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 5,
        max: 300,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
