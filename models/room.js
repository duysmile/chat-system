const { mongoose } = require('./index');

function limitMembers(members) {
    return members.length <= 10;
}

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        max: 100,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',            
        }],
        required: true,
        validate: [limitMembers, 'Limit members of room is 10']
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    type: {
        type: String,
        enum: ['individual', 'room'],
        required: true
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
