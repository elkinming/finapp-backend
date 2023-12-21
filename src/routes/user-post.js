const express = require ('express');
const router = new express.Router();

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbUser = require('../db/db-user');

router.post('/user', async (req, res) => {

    try {

        let {user} = req.body;

        _log.info(`POST /user request. User: ${user}`);
        if (!user){
            _log.error("Params Missing!");
             return res.status(400).send({
                errorCode: EnumErrors.ERROR_PARAMS_MISSING,
                errorMessage: 'ERROR_PARAMS_MISSING'
            })
        }

        let resCreateUser = await dbUser.createUser(user);
        
        if (resCreateUser.isUserCreated)
        {
            _log.info('SUCCESS at POST /user');
            return res.status(201).send({
                errorCode: EnumErrors.SUCCESS,
                errorMessage: 'SUCCESS'
            });

        } else if (resCreateUser.isUserRepeated) {
            _log.error('Error, Username already exist, Username: ' + user.username);
                return res.status(400).send({
                    errorCode: EnumErrors.ERROR_USER_ALREADY_EXIST,
                    errorMessage: 'ERROR_USER_ALREADY_EXIST'
                });

        } else {
            _log.error('Error at creating User');
            return res.status(400).send({
                errorCode: EnumErrors.ERROR_INVALID_DATA,
                errorMessage: 'ERROR_INVALID_DATA'
            });
        }

    } catch (err) {
        _log.error("Exception at POST /user, Err: " + err);
        res.status(500).send({
            errorCode: EnumErrors.ERROR_EXCEPTION,
            errorMessage: 'ERROR_EXCEPTION'
        })
    }

});


module.exports = router;