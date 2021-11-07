const nodemailer = require('nodemailer');

const {NODEMAILER_USER, NODEMAILER_PASS} = siteConfig

// Google 메일 형식
const transPorter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    auth : {
        user : NODEMAILER_USER,
        pass : NODEMAILER_PASS
    },
})

function sendMailer() {
    let instance = null;
    return {
        // SingleTon Patten
        getInstance : function() {
            if(instance == null) {
                // from : 보내는 사람
                // to   : 받는 사람
                // subject : 제목
                // html : 내용
                instance = async (from, to, subject, html) => {
                    const info = await transPorter.sendMail({
                        from : `${from} <${NODEMAILER_USER}>`,
                        to,
                        subject,
                        html
                    })
                    console.log('sendMailer Info', info);
                    return info;
                }
            }
            return instance
        }
    }
}

module.exports = sendMailer().getInstance();