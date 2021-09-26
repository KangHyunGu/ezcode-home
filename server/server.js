require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 앱 초기화
const app = express();
const port = process.env.VUE_APP_SERVER_PORT || 3000;
const webServer = http.createServer(app);

let isDiasbleKeppAlive = false;
app.use((req, res, next) => {
	if(isDiasbleKeppAlive){
		console.log('Keep Alive', isDiasbleKeppAlive);
		res.set('Connection', 'close');
	}
	next();
})

// 파비콘
// server.js에 업로드된 파일에 대한 라우터를 등록하고 favicon에 대한 처리도 함
app.use((req, res, next) => {
	if(req.path.indexOf('favicon.ico') > -1){
		const favicon = fs.readFileSync(path.join(__dirname, '../dist/favicon.ico'));
		res.status(200).end(favicon);
		return;
	}
	next();
});

// jwt 토근
const jwt = require('./plugins/jwt')
// console.log(jwt.getRendToken(32));
// console.log(jwt.generatePassword('abcd1234'));

// parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// fileUpload
const fileUpload = require('express-fileupload');
app.use(fileUpload());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// 글로벌 셋팅
global.MEMBER_PHOTO_PATH = path.join(__dirname, './upload/memberPhoto');
// 폴더 생성(./server/upload/memberPhoto)
fs.mkdirSync(MEMBER_PHOTO_PATH, {recursive:true});

// passport
const passport = require('./plugins/passport');
passport(app);

// 이미지 업로드
const thumbnail = require('./plugins/thumbnail');
app.use('/upload/:_path', thumbnail(path.join(__dirname, './upload')));

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist")));

// api 라우터
const memberRouter = require('./api/member');
app.use('/api/member', memberRouter);
app.use('/api/*', (req, res)=> {
	res.json({err : "요청하신 API가 없습니다."});
})

// Vue SSR
const { createBundleRenderer } = require('vue-server-renderer');
const { password } = require('../util/validateRules');
const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf-8');
const serverBundle = require(path.join(__dirname, '../dist/vue-ssr-server-bundle.json'));
const clientManifest = require(path.join(__dirname, '../dist/vue-ssr-client-manifest.json'));

app.get('*', (req, res) => {
	const renderer = createBundleRenderer(serverBundle, {
		runInNewContext : false,
		template,
		clientManifest,
	});
	console.log('server.js * router');
	const ctx = {
		url : req.url,
		title : 'Vue SSR App',
		metas : `<!-- inject more metas -->`,
		member : req.user || null,
		token : req.cookies.token || null
	};
	
	const stream = renderer.renderToStream(ctx);
	stream.on('end', ()=> {
		const memSize = Object.entries(process.memoryUsage())[0][1];
		console.log('스트림 렌더 종료 ', (memSize / 1024/1024).toFixed(4));
		//if(process.platform == 'linux') {
		//Object.entries(process.memoryUsage()) => Array
		//현재 사용 중인 메모리 사이즈
		if(process.platform == 'linux'){
			if(memSize > 150000000){
				process.emit('SIGINT');
			} 
		}
		//}
	}).pipe(res);
});

// 서버 리슨
webServer.listen(port, () => {
	process.send('ready');
	console.log(`http://localhost:${port}`);
});

process.on('SIGINT', function(){
	isDiasbleKeppAlive = true;
	webServer.close(function(){
		console.log('server Closed')
		process.exit(0);
	})
})


// 함수 람다식 표현
// 함수 정의 : test() => {}
// 파라미터 1 함수 내 1줄의 리턴일 경우 아래와 같이 축약 가능
// const test = param1 => param1 + 1000;'