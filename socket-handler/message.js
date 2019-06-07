const messageController = require('../controllers/message.controller');

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
                    socket.broadcast.emit('messages', {action: 'RECEIVE_TYPING'});
                    return callback(null, data);
                }
                case 'SEND_DONE_TYPING': {
                    socket.broadcast.emit('messages', {action: 'RECEIVE_DONE_TYPING'});
                    return callback(null, data);
                }
            }          
        } catch (error) {
            return callback(error);
        }
    });
};

const createMessage = async (socket, data, callback) => {
    // hard code room
    const room = '5ceeb6a89793871f281ab291';
    const responseData = await messageController.create({
        body: {
            // room: data.room,
            room,
            content: data.message
        },
        user: socket.user
    });
    socket.broadcast.emit('messages', {
        action: 'RECEIVE',
        message: responseData.data
    });
    return callback(null, responseData.data);
}
