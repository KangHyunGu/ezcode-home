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
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL} = process.env;

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
                return done(null, member);

            } catch(e) {
                console.log(e.message);
                return done(null, null, '아이디 또는 비밀번호 올바르지 않습니다.');
            }
        }
    ));

    passport.use(new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `${CALLBACK_URL}/api/member/google-callback`,
			passReqToCallback: true
		},
        async function (request, accessToken, refreshToken, profile, done) {
			// console.log(profile);
			if(profile && profile.id) {
				const member = await memberModel.loginGoogle(request, profile);
				return done(null, member);
			} else {
				return done('로그인 실패', null )
			}
		}
	));

    app.use(async (req, res, next) => {
        const token = req.cookies.token;
        if(!token) return next();
        const {mb_id} = jwt.verify(token);
        if(!mb_id) return next();
        try{
            const member = await memberModel.getMemberBy({mb_id});
            req.login(member, {session:false}, (err) => {})
        } catch(e){
            console.log('auth error ', e)
        }

        next();
    });
}