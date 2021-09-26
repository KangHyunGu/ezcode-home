const router = require('express').Router();
const memberModel = require('./_model/memberModel');
const { modelCall } = require('../../util/lib');
const passport = require('passport');
const jwt = require('../plugins/jwt')

// /api/member/duplicateCheck/mb_id/abcd
// MVC 패턴

router.get('/duplicateCheck/:field/:value', async (req, res)=> {
    const result = await modelCall(memberModel.duplicateCheck, req.params);
	res.json(result);
})

// 회원가입
router.post('/', async (req, res) => {
    const result = await modelCall(memberModel.createMember, req);
    res.json(result);
})

// 로그인
router.post('/loginLocal', async (req, res) => {
    //passport authenticate를 이용하여 done 함수 호출
    passport.authenticate('local', function(err, member, info){
        //info가 존재 할 경우 error로 판단
        if(info) {
            res.json({err : info})
        } else {
            //passport 에서 initialize req의 login, logout 함수 생김
            //session을 true를 하였을 때 express-Session에서 관리
            //
            //false를 설정 하였을 때 cookie 값 활용
            req.login(member, {session : false}, (err) => {
                if(err){
                    console.log('loginLocal', err)
                    res.json({err})
                } else {
                    // token 값 가져 올 때
                    const token = jwt.getToken(member);
                    const data = memberModel.loginMember(req);
                    member.mb_login_at = data.mb_login_at
                    member.mb_login_ip = data.mb_login_ip
                    // 응답 시 Cookie가 브라우져에 생성
                    res.cookie('token', token, {httpOnly:true})
                    res.json({member, token});
                }
            })
        }
    })(req, res);
    // const result = await modelCall(memberModel.createMember, req);
    // res.json(result);
})

// 인증
router.get('/auth', (req, res) => {
    const member = req.user || null;
    const token = req.cookies.token || null;
    console.log('auth 인증', req.user);
    res.json({member, token});
    //res.json(req.user || false);
})

// 로그아웃
router.get('/signOut', (req, res) => {
    res.clearCookie('token');
    res.json(true);
})

// 아이디 찾기
router.get('/findId', async (req, res) => {
    const result = await modelCall(memberModel.findId, req.query)
    res.json(result);
})

// 비밀번호 찾기
router.get('/findPw', async (req, res) => {
    const result = await modelCall(memberModel.findPw, req)
    res.json(result);
})

// 비밀번호 변경
router.patch('/modifyPassword', async(req, res) => {
    const result = await modelCall(memberModel.modifyPassword, req.body)
    res.json(result)
})

// 구글 로그인 요청
router.get('/loginGoogle', passport.authenticate('google', {scope: ['email', 'profile']}));

// 구글 로그인 콜백
router.get('/google-callback', (req, res) => {
    //passport authenticate를 이용하여 done 함수 호출
    passport.authenticate('google', async function(err, member){
     const result = await modelCall(memberModel.socialCallback, req, res, err, member);
     res.end(result);
    })(req, res);
})

// 카카오 로그인 요청
router.get('/loginKakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백
router.get('/kakao-callback', (req, res) => {
    //passport authenticate를 이용하여 done 함수 호출
    passport.authenticate('kakao', async function(err, member){
      const result = await modelCall(memberModel.socialCallback, req, res, err, member);
    //  res.end(result);
    console.log('member : ' ,member);
    res.end(result);
    })(req, res);
})

// 네이버 로그인 요청
router.get('/loginNaver', passport.authenticate('naver'));

// 네이버 로그인 콜백
router.get('/naver-callback', (req, res) => {
    passport.authenticate('naver', async function(err, member){
         const result = await modelCall(memberModel.socialCallback, req, res, err, member);
        //res.json(member);
      res.end(result);
      })(req, res);
});

module.exports = router;