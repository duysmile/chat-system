const message = require('./message');
const room = require('./room');

exports.initialize = (io) => {
    io.on('connection', function(socket) {
        console.log('A user is connected.');
        const userId = socket.user._id;
        socket.join(userId);
        const countMultiDevicesOnline = numClientsInRoom(io, '/', userId);
        if (countMultiDevicesOnline === 1) {
            // TODO: update online status -> true
        }
        console.log(countMultiDevicesOnline);
        // ----------------------
        // ------INIT EVENT------
        // ----------------------
        message.initEvent(socket);
        room.initEvent(socket);
        
        socket.on('disconnect', function() {
            console.log('A user is disconnect.');
            const countMultiDevicesOnline = numClientsInRoom(io, '/', userId);
            console.log(countMultiDevicesOnline);
            if (countMultiDevicesOnline === 0) {
                // TODO: update online status -> false
            }
        })
    });
};

function numClientsInRoom(io, namespace, room) {
    const clients = io.nsps[namespace].adapter.rooms[room];
    if (!clients) {
        return 0;
    }
    return clients.length; // number clients in room
}