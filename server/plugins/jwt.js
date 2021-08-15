require('dotenv').config();
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const crypto = require('crypto');

const {SECRET_KEY} = process.env;

const options = {
    algorithm : 'HS256',
    issuer : 'ezhome',
    // expiresIn : '30m'
}

const token = {
    getRendToken(len=64) {
        return randToken.generate(len);
    },
    generatePassword(passWord) {
        return crypto.pbkdf2Sync(passWord, SECRET_KEY, 10, 64, 'sha512').toString('base64');
    },
    getToken(user) {
        const payload = {
            mb_id : user.mb_id
        };
        return jwt.sign(payload, SECRET_KEY, options);
    },
    verify(token) {
        try{
            return jwt.verify(token, SECRET_KEY)
        } catch(e) {
            return {err : e.message}
        }
    }
}

module.exports = token;