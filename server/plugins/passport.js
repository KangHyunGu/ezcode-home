require('dotenv').config();
//passport
const passport = require('passport')
//passport Local
const LocalStrategy = require('passport-local').Strategy;
// jwt 암호화 된 패스워드 활용하여 passport에 저장하기 위한 용도?
const jwt = require('../plugins/jwt')
const memberModel = require('../api/_model/memberModel')
const {Strategy : JWTStrategy, ExtractJwt} = require('passport-jwt')
const { SECRET_KEY } = process.env

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
    ))

    passport.use(new JWTStrategy(
        {  
            // 임의의 헤더에 보낼 경우
            //jwtFromRequest : ExtractJwt.fromHeader('authorization'),
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
            secretOrKey: SECRET_KEY        
        }, 
        async (payload, done) => {
            // 정상적으로 passport 인증이 되지 않을 경우 payload가 나오지 않음
            try {
                const {mb_id} = payload;
                const member = await memberModel.getMemberBy({mb_id});
                if(!member){
                    throw new Error('회원 토큰이 유효하지 않습니다.')
                }
                return done(null, member)
            }catch(e) {
                return done(e);
            }
        }
    ));

    app.use(async (req, res, next) => {
        if(req.headers.authorization){
            passport.authenticate('jwt', (err, user)=> {
                if(user){
                    // 로그인
                    console.log('user : ', user)
                    // req.login 할 경우 req.user 데이터가 들어간다.
                    req.login(user, {session : false}, (err) => {});
                } else {
                    // 로그아웃
                    try{
                        req.logout()
                    } catch(e){
    
                    }
                }
                next();
            })(req, res, next);
        } else if(req.cookies.token){
            try{
            //인증
            const payload = jwt.verify(req.cookies.token)
            const { mb_id } = payload;
            const member = await memberModel.getMemberBy({mb_id})
            if(!member) {
                throw new Error('회원 토큰이 유효하지 않습니다.')
            }
            req.login(member, {sesstion: false}, (err) => {});
            console.log('payload : ', payload);
            } catch(e){}
            next();
        } else {
            next();
        }
    });
}