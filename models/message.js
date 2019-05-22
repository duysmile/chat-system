const { mongoose } = require('./index');

const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        max: 300
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room'
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
