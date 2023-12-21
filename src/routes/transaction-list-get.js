const express = require ('express');
const router = new express.Router();

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbTransaction = require('../db/db-transaction');
const validateToken = require('../middleware/validate-token')

router.get('/budget/:uuid_budget/transactions', validateToken, async (req, res) => {

    try {
        const uuid_budget = req.params.uuid_budget;
        const uuid_user = req.userLogged.uuid_user;
        _log.info(`GET /budget/${uuid_budget}/transactions request.`);        
        

        let resGetTransactions = await dbTransaction.getTransactionsByBudgetId(uuid_budget);
        
        if (!resGetTransactions.error && resGetTransactions.transactions)
        {
            _log.info('SUCCESS at GET /budget/transactions');
            return res.status(201).send({
                errorCode: EnumErrors.SUCCESS,
                errorMessage: 'SUCCESS',
                transactions: resGetTransactions.transactions
            });

        }
    
        else {
            _log.error("Exception at GET /budget/transactions, Err: " + resGetTransactions.error);
            res.status(500).send({
                errorCode: EnumErrors.ERROR_EXCEPTION,
                errorMessage: 'ERROR_EXCEPTION'
            })
    
        }

    } catch (err) {
      _log.error("Exception at GET /budget/transactions, Err: " + err);
      res.status(500).send({
          errorCode: EnumErrors.ERROR_EXCEPTION,
          errorMessage: 'ERROR_EXCEPTION'
      })
    }

});


module.exports = router;
