let _db = require('./db-connection');
let _log = require('../logger/logger');

let functions = {}

functions.getUserbyId = async (Id) => {
    try {
        _log.info(`Init: getUserbyId, Params: Id: ${Id}`);
        let text = 'SELECT * FROM users WHERE uuid_user = $1';
        let values = [Id];
        let result = await _db.query(text, values);    
        _log.info(`Users found: ` + result.rowCount);
        return result.rows[0];

    } catch (error) {
        _log.error('Exception at function getUserbyId, Err: ' + error);
        return null;
    }

}

module.exports = functions;