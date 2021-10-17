require('dotenv').config();
//passport
const passport = require('passport')
//passport Local
const LocalStrategy = require('passport-local').Strategy;
// jwt 암호화 된 패스워드 활용하여 passport에 저장하기 위한 용도?
const jwt = require('../plugins/jwt')
const memberModel = require('../api/_model/memberModel')
//const {Strategy : JWTStrategy, ExtractJwt} = require('passport-jwt')
//const { SECRET_KEY } = process.env
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const {LV, LV_LABEL} = require('../../util/level');

const {GOOGLE_CLIENT_ID, 
       GOOGLE_CLIENT_SECRET, 
       KAKAO_CLIENT_ID, 
       KAKAO_CLIENT_SECRET, 
       NAVER_CLIENT_ID, 
       NAVER_CLIENT_SECRET, 
       CALLBACK_URL} = process.env;

// 로그인 규칙
function loginResult(member){
    
    if(member.mb_leave_at) {
        return '탈퇴 회원 입니다.'
    }
    switch(member.mb_level){
        case LV.AWAIT:
            return '대기 회원입니다.'
        case LV.BLOCK:
            return '차단 회원입니다.'    
    }
}

module.exports = (app) => {
    // passport 초기화
    app.use(passport.initialize());

    passport.use(new LocalStrategy(
        //param 1
        {
            //LocalStrategy만의 규칙
            usernameField : 'mb_id',
            passwordField : 'mb_password'
        },
        //param 2
        async(mb_id, mb_password, done) => {
            try {
                mb_password = jwt.generatePassword(mb_password);
                //아이디 및 비밀번호를 저장 된 DB검색
                const member = await memberModel.getMemberBy({mb_id, mb_password});
                
                // 로그인 체크..
                const msg = loginResult(member);
                if(msg) {
                    return done(null, null, msg);
                }
                
                // 체크 후 완료
                return done(null, member);

            } catch(e) {
                console.log(e.message);
                return done(null, null, '아이디 또는 비밀번호 올바르지 않습니다.');
            }
        }
    ));
    
    // 구글 로그인
    // request 받을 경우 passReqToCallback: true)
    // default 값은 false임
    passport.use(new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `${CALLBACK_URL}/api/member/google-callback`,
			passReqToCallback: true
		},
        async function (request, accessToken, refreshToken, profile, done) {
			if(profile && profile.id) {
				const member = await memberModel.loginGoogle(request, profile);
                const msg = loginResult(member);
                console.log('msg : ', msg);
                if(msg) {
                    return done(msg, null, null);
                }
				return done(null, member);
			} else {
				return done('로그인 실패', null )
			}
		}
	));
    
    // 카카오 로그인
    // request 받을 경우 passReqToCallback: true)
    // default 값은 false임
    passport.use(new KakaoStrategy({
        clientID : KAKAO_CLIENT_ID,
        clientSecret: KAKAO_CLIENT_SECRET, 
        callbackURL : `${CALLBACK_URL}/api/member/kakao-callback`,
        passReqToCallback: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        if(profile && profile.id) {
            const member = await memberModel.loginKakao(request, profile);
            const msg = loginResult(member);
            if(msg) {
                return done(msg, null, null);
            }
            return done(null, member);
        } else {
            return done('로그인 실패', null )
        }
      }
))
    
    //네이버 로그인
    passport.use(new NaverStrategy({
        clientID: NAVER_CLIENT_ID,
        clientSecret: NAVER_CLIENT_SECRET,
        callbackURL: `${CALLBACK_URL}/api/member/naver-callback`,
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {   
       if(profile && profile.id) {
            const member = await memberModel.loginNaver(request, profile);
            const msg = loginResult(member);
            if(msg) {
                return done(msg, null, null);
            }
            return done(null, member);
        } else {
            return done('로그인 실패', null )
        }
      }
));
    // 토큰 인증 처리
    app.use(async (req, res, next) => {
        const token = req.cookies.token;
        if(!token) return next();
        const {mb_id} = jwt.verify(token);
        if(!mb_id) return next();
        try{
            const member = await memberModel.getMemberBy({mb_id});
            const msg = loginResult(member);
            if(msg) {
                return next();
            }
            req.login(member, {session:false}, (err) => {})
        } catch(e){
            console.log('auth error ', e)
        }

        next();
    });
}