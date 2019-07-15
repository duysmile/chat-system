const message = require('./message');
const video = require('./video');
const { userRepository } = require('../repositories');

exports.initialize = (io) => {
    io.on('connection', async function(socket) {
        try {
            console.log('A user is connected.');
            const userId = socket.user._id;
            socket.join(userId);
            const countMultiDevicesOnline = numClientsInRoom(io, '/', userId);
            if (countMultiDevicesOnline === 1) {
                await userRepository.updateOne({
                    where: {
                        _id: userId
                    },
                    data: {
                        isOnline: true
                    }
                });
                socket.broadcast.emit('status', {
                    action: 'ONLINE',
                    data: userId
                });
            }
            console.log(countMultiDevicesOnline);
            // ----------------------
            // ------INIT EVENT------
            // ----------------------
            message.initEvent(socket);
            video.initEvent(socket);
            
            socket.on('disconnect', async function() {
                io.sockets.emit('user-left', socket.id)

                try {
                    console.log('A user is disconnect.');
                    const countMultiDevicesOnline = numClientsInRoom(io, '/', userId);
                    console.log(countMultiDevicesOnline);
                    if (countMultiDevicesOnline === 0) {
                        await userRepository.updateOne({
                            where: {
                                _id: userId
                            },
                            data: {
                                isOnline: false
                            }
                        });
                        socket.broadcast.emit('status', {
                            action: 'OFFLINE',
                            data: userId
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            })
        } catch (error) {
            console.error(error);            
        }
    });
};

function numClientsInRoom(io, namespace, room) {
    const clients = io.nsps[namespace].adapter.rooms[room];
    if (!clients) {
        return 0;
    }
    return clients.length; // number clients in room
}