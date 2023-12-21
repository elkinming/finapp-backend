let _db = require('./db-connection');
let _log = require('../logger/logger');

let functions = {}

functions.getTransactionsByBudgetId = async (uuid) => {
  let response = {};
  try {
    _log.info(`Init: getTransactionsByBudgetId, Params: uuid_budget: ${uuid}`);
    let text = 'SELECT * FROM transaction WHERE uuid_budget = $1';
    let values = [uuid];
    let result = await _db.query(text, values);    
    _log.info(`Transactions found: ` + result.rowCount);
    response.transactions = result.rows;
    response.error = null;
    return response;

  } catch (error) {
    _log.error('Exception at function getTransactionsByBudgetId, Err: ' + JSON.stringify(error, null, 4));
    response.transactions = [];
    response.error = error;
    return response;
  }

}

functions.createTransaction = async (transaction) => {
  let response = {};
  try {
    _log.info(`Init: createTransaction, Params: transaction: ${JSON.stringify(transaction)}`);
    let text = `insert into transaction 
    ( description, value, uuid_user, uuid_budget ) 
    values ( $1, $2, $3, $4 )`;
    let values = [
      transaction.description,
      transaction.value,
      transaction.uuid_user,
      transaction.uuid_budget,
    ];

    let result = await _db.query(text, values);    
    _log.info(`Transaction Created`);
    response.isTransactionCreated = true;
    response.error = null;
    return response;

  } catch (error) {
    _log.error('Exception at function createTransaction, Err: ' + JSON.stringify(error, null, 4));
    response.isTransactionCreated = false;
    response.error = error;
    return response;
  }

}

module.exports = functions;