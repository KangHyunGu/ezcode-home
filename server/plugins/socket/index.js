const {Server} = require('socket.io')
const configHandler = require('./configHandler');

module.exports = function(webServer){
    //socket Io 생성
    const io = new Server(webServer);
  
    //socket Io 연결 될 경우
    io.on('connection', (socket) => {
        configHandler(io, socket)
        console.log('a user connected ' + socket.id);

        socket.on('disconnect', () => {
            console.log('disconnect');
        });

        // 
        socket.on('room:join', (roomName)=> {
            console.log('room:join', roomName);
            //room:join이란 이름으로 join 처리
            socket.join(roomName)
        });

        //
        socket.on('room:leave', (roomName)=> {
            console.log('room:leave', roomName);
            socket.leave(roomName);
        });

        socket.on('room:send', (data)=> {
            console.log(data);
            const msg = data.msg + ' 서버 응답';
            //io.emit('room:msg', {msg})
            //socket.broadcast.emit('room:msg', {msg})
            io.to('roomtest').emit('room:msg', {msg})
        });
    })


}