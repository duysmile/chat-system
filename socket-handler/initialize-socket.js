const message = require('./message');

exports.initialize = (io) => {
    io.on('connection', function(socket) {
        console.log('A user is connected.');
        message.initEvent(socket);
        
        socket.on('disconnect', function() {
            console.log('A user is disconnect.');
        })
    });
};