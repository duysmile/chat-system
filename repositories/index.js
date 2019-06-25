const BaseRepository = require('./base.repository');
const RoomRepository = require('./room.repository');
// const User = require('../models/user');
const Message = require('../models/message');
const User = require('../models/user');

module.exports = {
    userRepository: new BaseRepository('User'),
    roomRepository: new RoomRepository(),
    messageRepository: new BaseRepository('Message'),
};