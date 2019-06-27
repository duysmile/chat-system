const messageController = require('../controllers/message.controller');
const roomController = require('../controllers/room.controller');

exports.initEvent = (socket) => {
    socket.on('messages', async function(data, callback) {
        try {
            if (!data) {
                return callback(new Error('INVALID_DATA'));
            }
            switch (data.action) {
                case 'SEND': {
                    return await createMessage(socket, data, callback);
                }
                // case 'SEND': {

                // }
                case 'SEND_TYPING': {
                    socket.broadcast.emit('messages', {
                        action: 'RECEIVE_TYPING',
                        roomId: data.roomId
                    });
                    return callback(null, data);
                }
                case 'SEND_DONE_TYPING': {
                    socket.broadcast.emit('messages', {
                        action: 'RECEIVE_DONE_TYPING',
                        roomId: data.roomId
                    });
                    return callback(null, data);
                }
            }          
        } catch (error) {
            return callback(error);
        }
    });
};

const createMessage = async (socket, data, callback) => {
    const room = data.room;
    const messageRequest = messageController.create({
        body: {
            room,
            content: data.message
        },
        user: socket.user
    });

    const roomRequest = roomController.getById({
        params: {
            id: room
        },
        user: socket.user
    });

    const [messageResponseData, roomResponseData] = await Promise.all([messageRequest, roomRequest]);
    
    roomResponseData.data.members.map(member => {
        socket.to(member._id.toString()).broadcast.emit('messages', {
            action: 'RECEIVE',
            roomId: room,
            roomName: roomResponseData.data.name,
            message: messageResponseData.data
        });
    });
    
    return callback(null, messageResponseData.data);
};
