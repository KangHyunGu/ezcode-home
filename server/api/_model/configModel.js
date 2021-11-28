const db = require('../../plugins/mysql');

const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
	async load() {
		const sql = sqlHelper.SelectSimple(TABLE.CONFIG, null, ['cf_key', 'cf_val', 'cf_client', 'cf_type']);
		const [rows] = await db.execute(sql.query);
		global.siteConfig = {};
		global.clientConfig = {};
		for(const row of rows){
			configModel.setConfigItem(row, true);
		}
	},
	setConfigItem(item, isLoad = false) {
		configModel.clearConfigItem(item.cf_key, isLoad);
		let val;
		if(item.cf_type == 'Json'){
			//type Json 형태 일 경우 Parsing이 필요
			val = JSON.parse(item.cf_val);
		} else {
			val = item.cf_val
		}
		
		if(item.cf_client == 1){
			clientConfig[item.cf_key] = val
		} else {
			siteConfig[item.cf_key] = val
		}

		// 초기로드가 아니면 메세지 보낸다.
		if(!isLoad) {
			process.send({
				type: 'config:update',
				data : item,
			});
		}
		//console.log(item.cf_key, item);

	},
	clearConfigItem(cf_key, isLoad = false){
		delete clientConfig[cf_key]
		delete siteConfig[cf_key]
		//초기로드가 아니면 메세지 보낸다.
		if(!isLoad) {
			console.log('cf_key : ' , cf_key);
			process.send({
				type: 'config:remove',
				data : cf_key,
			});
		}
	},
	async duplicateCheck({ field, value }) {
		const sql = sqlHelper.SelectSimple(
			TABLE.CONFIG,
			{ [field]: value },
			['COUNT(*) AS cnt']
		);
		const [[row]] = await db.execute(sql.query, sql.values);
		return row;
	},
	async get(req) {
		const { all } = req.query;
		let where = {};
		if(all == 'true') {
			if(!isGrant(req, LV.ADMIN)) {
				throw new Error('관리자 설정 목록 권한이 없습니다.')
			}
			const sort = {
				cf_group : true,
				cf_sort : true,
			}
		
			const sql = sqlHelper.SelectSimple(TABLE.CONFIG, where, [], sort);
			const [rows] = await db.execute(sql.query, sql.values);
			return rows;
		} else {
		//	where.cf_client = 1;
			return clientConfig;
		}
	}, 
	async post(data) {
		// const data = req.body;

		// const maxSql = sqlHelper.SelectSimple(
		// 	TABLE.CONFIG, 
		// 	{cf_group : data.cf_group}, 
		// 	['IFNULL(MAX(cf_sort), -1) AS max']
		// );

		// const [[{max}]] = await db.execute(maxSql.query, maxSql.values);
		// data.cf_sort = max+1;

		const sql = sqlHelper.InsertOrUpdate(TABLE.CONFIG, data);
		const [row] = await db.execute(sql.query, sql.values); 
		configModel.setConfigItem(data);
		return data; // 업뎃된거 넘겨줄거고
	},
	async put(req) { // 정렬
		req.body.forEach((item)=>{
			const {cf_key, cf_sort} = item;
			const sql = sqlHelper.Update(TABLE.CONFIG, {cf_sort}, {cf_key})
			db.execute(sql.query, sql.values)
		})
		return true;
	},
	async remove(req) {
		if(!isGrant(req, LV.SUPER)) {
			throw new Error('최고관리자만 삭제가 가능합니다.')
		}
		const {cf_key} = req.params;
		const sql = sqlHelper.DeleteSimple(TABLE.CONFIG, {cf_key});
		const [row] = await db.execute(sql.query, sql.values);

		configModel.clearConfigItem(row); //설정 값 삭제
		return row.affectedRows == 1;
	}

};

module.exports = configModel;