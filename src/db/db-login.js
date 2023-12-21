let _db = require('./db-connection');
let _log = require('../logger/logger');

let functions = {}

functions.getUserbyUsername = async (username) => {
    
    try {
        _log.info(`Init: getUserbyUsername, Params: username: ${username}`);
        let text = 'SELECT * FROM users WHERE username = $1';
        let values = [username];
        let result = await _db.query(text, values);    
        _log.info(`Users found: ` + result.rowCount);
        return result.rows[0];

    } catch (error) {
        _log.error('Exception at function getUserbyEmail, Err: ' + error);
        return null;
    }

}

module.exports = functions;