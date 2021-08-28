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
                    res.json({member, token});
                }
            })
        }
    })(req, res);
    // const result = await modelCall(memberModel.createMember, req);
    // res.json(result);
})


module.exports = router;