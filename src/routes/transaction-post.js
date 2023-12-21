const express = require ('express');
const router = new express.Router();

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbTransaction = require('../db/db-transaction');
const validateToken = require('../middleware/validate-token');

router.post('/budget/:uuid_budget/transaction',validateToken , async (req, res) => {

    try {

        const transaction = req.body;

        _log.info(`POST /budget/transaction request. Transaction: ${JSON.stringify(transaction)}`);
        if (!transaction){
            _log.error("Params Missing!");
             return res.status(400).send({
                errorCode: EnumErrors.ERROR_PARAMS_MISSING,
                errorMessage: 'ERROR_PARAMS_MISSING'
            })
        }

        let resCreateTransaction = await dbTransaction.createTransaction(transaction);
        
        if (resCreateTransaction.isTransactionCreated)
        {
            _log.info('SUCCESS at POST /budget/transaction');
            return res.status(201).send({
                errorCode: EnumErrors.SUCCESS,
                errorMessage: 'SUCCESS'
            });
        }
        else {
            _log.error('Error at creating transaction');
            return res.status(400).send({
                errorCode: EnumErrors.ERROR_INVALID_DATA,
                errorMessage: 'ERROR_INVALID_DATA'
            });
        }

    } catch (err) {
        _log.error("Exception at POST /budget/transaction, Err: " + err);
        res.status(500).send({
            errorCode: EnumErrors.ERROR_EXCEPTION,
            errorMessage: 'ERROR_EXCEPTION'
        })
    }

});


module.exports = router;