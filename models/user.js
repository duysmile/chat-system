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
    },
    email: {
        type: String,
        max: 300,
        required: true,
        unique: true
    },
    token: {
        type: String,
        max: 300
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    geoPosition: {
        type: [Number]
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;