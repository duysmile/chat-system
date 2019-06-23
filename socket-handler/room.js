const roomController = require('../controllers/room.controller');

exports.initEvent = (socket) => {
    socket.on('rooms', async function(data, callback) {
        try {
            if (!data) {
                return callback(new Error('INVALID_DATA'));
            }
            switch (data.action) {
                // case 'JOIN': {
                //     socket.join(data.roomId);
                //     return callback(null, true);
                // }
            }          
        } catch (error) {
            return callback(error);
        }
    });
};
