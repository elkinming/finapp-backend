const { Pool } = require('pg')
const pool = new Pool()

let functions = {};

functions.query = (text, params) => {
    return pool.query(text, params);
}

module.exports = functions;