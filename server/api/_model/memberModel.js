const db = require('../../plugins/mysql')
const sqlHelper = require('../../../util/sqlHelper')
const TABLE =  require('../../../util/TABLE')
const { LV } = require('../../../util/level')
const moment = require('../../../util/moment')
const { getIp } = require('../../../util/lib')

async function getDefaultMemberLevel() {
    const sql = sqlHelper.SelectSimple(
        TABLE.MEMBER,
        null,
        ['COUNT(*) AS cnt']
    );

    console.log('getDefaultMemberLevel sql : ', sql)

    const [[row]] = await db.execute(sql.query, sql.values);
    console.log(row);
    if(row.cnt > 0){
        return LV.MEMBER
    } else {
        return LV.SUPER
    }
}

const memberModel = {
    async duplicateCheck({field, value}) {
        const sql = sqlHelper.SelectSimple(
            TABLE.MEMBER, 
            {[field]: value}, 
            ['COUNT(*) AS cnt']
        );

        const [[row]] = await db.execute(sql.query, sql.values);
        return row;
    },
    async createMember(req) {
        console.log('createMember', req.body);
        const at = moment().format('LT');
        const ip = getIp(req);
        const payload = {
            ...req.body,
            //mb_password : 암호화(추후 처리)
            mb_level : await getDefaultMemberLevel(),
            mb_create_at : at,
            mb_create_ip : ip,
            mb_update_at : at,
            mb_update_ip : ip,
        }
        const sql = sqlHelper.Insert(TABLE.MEMBER, payload)
        console.log(sql);
        return req.body
    }

}

module.exports = memberModel;