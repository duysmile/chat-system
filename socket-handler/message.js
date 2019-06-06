const messageController = require('../controllers/message.controller');

exports.initEvent = (socket) => {
    socket.on('messages', async function(data, callback) {
        try {
            if (!data) {
                return callback(new Error('INVALID_DATA'));
            }
            switch (data.action) {
                case 'RECEIVE': {
                    return await createMessage(socket, data, callback);
                }
                // case 'SEND': {

                // }
                case 'SEND_TYPING': {
                    socket.broadcast.emit('receive-typing');
                    return callback(null, data);
                }
                case 'SEND_DONE_TYPING': {
                    socket.broadcast.emit('receive-done-typing');
                    return callback(null, data);
                }
            }          
        } catch (error) {
            return callback(error);
        }
    });
};

const createMessage = async (socket, data, callback) => {
    socket.broadcast.emit('send-message', data.message);

    return callback(null, data);
}
