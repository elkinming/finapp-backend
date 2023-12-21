const express = require ('express');
const router = new express.Router();

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbBudget = require('../db/db-budget');
const validateToken = require('../middleware/validate-token');

router.post('/budget',validateToken , async (req, res) => {

    try {

        let budget = req.body;

        _log.info(`POST /budget request. Budget: ${JSON.stringify(budget)}`);
        if (!budget){
            _log.error("Params Missing!");
             return res.status(400).send({
                errorCode: EnumErrors.ERROR_PARAMS_MISSING,
                errorMessage: 'ERROR_PARAMS_MISSING'
            })
        }

        let resCreateBudget = await dbBudget.createBudget(budget);
        
        if (resCreateBudget.isBudgetCreated)
        {
            _log.info('SUCCESS at POST /budget');
            return res.status(201).send({
                errorCode: EnumErrors.SUCCESS,
                errorMessage: 'SUCCESS'
            });
        }
        else {
            _log.error('Error at creating budget');
            return res.status(400).send({
                errorCode: EnumErrors.ERROR_INVALID_DATA,
                errorMessage: 'ERROR_INVALID_DATA'
            });
        }

    } catch (err) {
        _log.error("Exception at POST /budget, Err: " + err);
        res.status(500).send({
            errorCode: EnumErrors.ERROR_EXCEPTION,
            errorMessage: 'ERROR_EXCEPTION'
        })
    }

});


module.exports = router;