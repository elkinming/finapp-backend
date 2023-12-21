const jwt = require('jsonwebtoken');

const _log = require('../logger/logger');
const dbValidateToken = require ('../db/db-validate-token');
const EnumErrors = require('../enum-error.json');

const key = process.env.JWT_KEY;

const validateToken = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        _log.info('Validating Token: ' + token);
        let decodedData = null;

        try {
            decodedData = jwt.verify(token, key);
            _log.info('decodedData: ' + JSON.stringify(decodedData));

        } catch (error) {
            _log.error('Error, Invalid Token, Err: ' + error);
            return res.status(400).send({
                errorCode: EnumErrors.ERROR_INVALID_TOKEN,
                errorMessage: 'ERROR_INVALID_TOKEN'
            })
        }
  

        let userFound = await dbValidateToken.getUserbyId(decodedData.uuid_user);

        if (!userFound){
            _log.error('Error, User not found')
            return res.status(404).send({
                errorCode: EnumErrors.ERROR_USER_NOT_FOUND,
                errorMessage: 'ERROR_USER_NOT_FOUND'
            })
        }

        req.userLogged = userFound;
        next();

    } catch (err) {
        _log.error("Exception, Err: " + err);
        res.status(401).send({
            errorCode: EnumErrors.ERROR_INVALID_TOKEN,
            errorMessage: 'ERROR_INVALID_TOKEN'
        })
    }

};

module.exports = validateToken;