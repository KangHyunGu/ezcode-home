module.exports = (io, socket) => {
    const update = (data) => {
        console.log('update', data);
        io.emit('config:update', data);
    }

    const remove = (data) => {
        io.emit('config:remove', data);
    }
    console.log('update remove');
    socket.on('config:update', update);
    socket.on('config:remove', remove);
}