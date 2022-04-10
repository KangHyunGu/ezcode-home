const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');

const tagModel = {
    async registerTags(bo_table, wr_id, wrTags) {
        // 이미 등록 된 게시판 ID 해당되는 태그를 모두 제거
        await tagModel.deleteTags(bo_table, wr_id);
        // 태그 목록을 모두 삽입
        const tagData = [];
        for (const bt_tag of wrTags) {
            tagData.push({ bo_table, wr_id, bt_tag })
        }
        /*
       
        [
            {bo_table, wr_id, bt_tag : wrTags[0]},
            {bo_table, wr_id, bt_tag : wrTags[1]},
            {bo_table, wr_id, bt_tag : wrTags[2]},
        ]

        - INSERT (N) 건 Query문 예제
        INSERT INTO TABLE (a, b, c) VALUES(?, ?, ?), (?, ?, ?), (?, '?', ?);
        values = 
        */
        if (tagData.length) {
            const sql = sqlHelper.InsertArray(TABLE.BOARD_TAGS, tagData);
            await db.execute(sql.query, sql.values);
        }
    },

    async deleteTags(bo_table, wr_id) {
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_TAGS, {
            bo_table,
            wr_id
        });
        await db.execute(sql.query, sql.values);
    },

    async getTags(bo_table, wr_id) {
        const sql = sqlHelper.SelectSimple(TABLE.BOARD_TAGS, { bo_table, wr_id }, ['bt_tag']);
        const [rows] = await db.execute(sql.query, sql.values);
        const wrTags = [];
        for (const row of rows) {
            wrTags.push(row.bt_tag);
        }
        return wrTags;
    }
}

module.exports = tagModel;