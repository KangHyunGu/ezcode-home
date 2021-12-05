import Vue from 'vue';
import io from 'socket.io/client-dist/socket.io';

//기존
//const socket = io();
//수정
//socket.io가 서버와 연결 할 때 
//websocket 방식으로 option정의
const socket = io({transports: ["websocket"]});


socket.onAny((event, ...args) => {
    console.log('SOCKET', event, args);
})

Vue.prototype.$socket = socket;
