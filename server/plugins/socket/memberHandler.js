module.exports = (io, socket) => {
    socket.on("member:admUpdate", (data) => {
        console.log('member:admUpdate socker Network...');
        io.to(data.mb_id).emit('member:admUpdate', data);
    })
}