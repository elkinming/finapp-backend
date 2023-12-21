const express = require ('express');
const router = new express.Router();

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbBudget = require('../db/db-budget');
const validateToken = require('../middleware/validate-token')

router.get('/budget/list', validateToken, async (req, res) => {

    try {

        const uuid_user = req.userLogged.uuid_user;
        _log.info(`GET /budget/list request.`);        
        

        let resGetBudget = await dbBudget.getBudgetListByUserId(uuid_user);
        
        if (!resGetBudget.error && resGetBudget.budgets)
        {
            _log.info('SUCCESS at GET /budget/list');
            return res.status(201).send({
                errorCode: EnumErrors.SUCCESS,
                errorMessage: 'SUCCESS',
                budgets: resGetBudget.budgets
            });

        }
    
        else {
            _log.error("Exception at GET /budget/list, Err: " + resGetBudget.error);
            res.status(500).send({
                errorCode: EnumErrors.ERROR_EXCEPTION,
                errorMessage: 'ERROR_EXCEPTION'
            })
    
        }

    } catch (err) {
      _log.error("Exception at GET /budget/list, Err: " + err);
      res.status(500).send({
          errorCode: EnumErrors.ERROR_EXCEPTION,
          errorMessage: 'ERROR_EXCEPTION'
      })
    }

});


module.exports = router;
