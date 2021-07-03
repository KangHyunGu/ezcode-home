require('dotenv').config();
const mysql = require('mysql2');

function createDatabases() {
    let instance = null;
    return {
        getInstance: function () {
            if (instance == null) {
                // instance 생성
                const config = {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE
                };
                // DB 연결
                const pool = mysql.createPool(config);
                instance = pool.promise();
            }
            return instance;
        }

    }
}

module.exports = createDatabases().getInstance();

//mysql 
// collback 함수 적용

//mysql2 
// promise 객체 적용