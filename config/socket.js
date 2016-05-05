module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
    socket.author = '';
    socket.text = '';
    socket.target = 0;
    socket.type = "";
    socket.added = ""

    socket.on('send', function (data) {

        data.request.text = tools.sanitize(data.request.comment);

        socket.author = data.request.author;
        socket.text = data.request.text;
        socket.target = data.request.target;
        socket.type = data.request.type;
        socket.added = data.request.added

        // insert data to DB and emit back to all connected sockets
        insertComment(socket, data.request);
    });

    socket.on('disconnect', function () {
        console.log('User disconnected');
    });

});
};