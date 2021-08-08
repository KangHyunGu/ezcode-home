const moment = require('moment');

//한국 포맷 설정
require('moment/locale/ko');
moment.locale('ko');

//포맷 형식 설정
moment.updateLocale('ko', {
    longDateFormat: {
        L : 'YYYY-MM-DD',
        LT : 'YYYY-MM-DD HH:mm:ss'
    }
});

module.exports = moment;