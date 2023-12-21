let _db = require('./db-connection');
let _log = require('../logger/logger');

let functions = {}

functions.getBudgetListByUserId = async (uuid) => {
  let response = {};
  try {
    _log.info(`Init: getBudgetListByUserId, Params: uuid_user: ${uuid}`);
    let text = 'SELECT * FROM budget WHERE uuid_user = $1';
    let values = [uuid];
    let result = await _db.query(text, values);    
    _log.info(`Budgets found: ` + result.rowCount);
    response.budgets = result.rows;
    response.error = null;
    return response;

  } catch (error) {
    _log.error('Exception at function getBudgetListByUserId, Err: ' + JSON.stringify(error, null, 4));
    response.budgets = [];
    response.error = error;
    return response;
  }

}

functions.createBudget = async (budget) => {
  let response = {};
  try {
    _log.info(`Init: createBudget, Params: budget: ${JSON.stringify(budget)}`);
    let text = `insert into budget 
    ( description, value, uuid_user ) 
    values ( $1, $2, $3 )`;
    let values = [
      budget.description,
      budget.value,
      budget.uuid_user,
    ];

    let result = await _db.query(text, values);    
    _log.info(`Budget Created`);
    response.isBudgetCreated = true;
    response.error = null;
    return response;

  } catch (error) {
    _log.error('Exception at function createBudget, Err: ' + JSON.stringify(error, null, 4));
    response.isBudgetCreated = false;
    response.error = error;
    return response;
  }

}

module.exports = functions;