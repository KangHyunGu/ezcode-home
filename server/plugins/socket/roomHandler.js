module.exports = (io, socket) => {
	socket.on('room:join', (roomName) => {
		console.log("room:join", roomName);
		socket.join(roomName);
	});

	//룸 이름의 배열로 join했을때
	socket.on('rooms:join', (arr) => {
		arr.forEach(room => {
			console.log("rooms:join", room);
			socket.join(room);
		});
	});

	socket.on('room:leave', (roomName) => {
		console.log("room:leave", roomName);
		socket.leave(roomName);
	});

	socket.on('rooms:leave', (arr) => {
		arr.forEach(room => {
			console.log("rooms:leave", room);
			socket.leave(room);
		});
	});

}