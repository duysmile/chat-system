exports.initEvent = (socket) => {
    socket.on('video', async function(data, callback) {
        try {
            if (!data) {
                return callback(new Error('INVALID_DATA'));
            }
            switch (data.action) {
                case 'signaling': {
                    console.log(data);
                    // const destination = data.toId;
                    socket.broadcast.emit('video', {
                        ...data,                        
                        action: 'signaling',
                        fromId: socket.user._id
                    });
                }
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
