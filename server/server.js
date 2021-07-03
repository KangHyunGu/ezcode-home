require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 앱 초기화
const app = express();
const port = process.env.SERVER_PORT || 3000;
const webServer = http.createServer(app);

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist")));

// Vue SSR
const { createBundleRenderer } = require('vue-server-renderer');
const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');
const serverBundle = require(path.join(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.join(__dirname, '../dist/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
	runInNewContext : false,
	template,
	clientManifest,
});

app.get('*', (req, res) => {
	const ctx = {
		url : req.url,
		title : 'Vue SSR App',
		metas : `<!-- inject more metas -->`,
	};

	const stream = renderer.renderToStream(ctx);

	stream.on('end', ()=> {
		console.log('스트림 렌더 종료');
	}).pipe(res);
});

// 서버 리슨
webServer.listen(port, () => {
	console.log(`http://localhost:${port}`)
});


// 함수 람다식 표현
// 함수 정의 : test() => {}
// 파라미터 1 함수 내 1줄의 리턴일 경우 아래와 같이 축약 가능
// const test = param1 => param1 + 1000;'