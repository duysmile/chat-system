const RoomRepository = require('./room.repository');
const UserRepository = require('./user.repository');
const MessageRepository = require('./message.repository');

module.exports = {
    roomRepository: new RoomRepository(),
    userRepository: new UserRepository(),
    messageRepository: new MessageRepository()
};