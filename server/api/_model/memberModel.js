//const db = require('../../plugins/mysql')

const memberModel = {
    async duplicateCheck({field, value}) {
        console.log('duplicateCheck', field, value);
        return {field, value}
    }

}

module.exports = memberModel;