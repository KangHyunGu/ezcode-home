require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');

// 앱 초기화
const app = express();
const port = process.env.SERVER_PORT || 3000;
const webServer = http.createServer(app);

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist")));

// 서버 리슨
webServer.listen(port, () => {
	console.log(`http://localhost:${port}`)
});


// 함수 람다식 표현
// 함수 정의 : test() => {}
// 파라미터 1 함수 내 1줄의 리턴일 경우 아래와 같이 축약 가능
// const test = param1 => param1 + 1000;'