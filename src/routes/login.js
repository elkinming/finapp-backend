const express = require ('express');
const router = new express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const _log = require('../logger/logger');
const EnumErrors = require('../enum-error.json');
const dbLogin = require('../db/db-login');

const key = process.env.JWT_KEY;
const expiresIn = process.env.JWT_EXPIRE_IN;

router.post('/user/login', async (req, res) => {

  try {

      const {username, password} = req.body;
      _log.info(`POST /user/login request. Username: ${username}, password: ${password}`);
      if (!username || !password){
          _log.error("Params Missing!");
           return res.status(400).send({
              errorCode: EnumErrors.ERROR_PARAMS_MISSING,
              errorMessage: 'ERROR_PARAMS_MISSING'
          })
      }

      let userFound = await dbLogin.getUserbyUsername(username);
      
      // Validacion si existe el user
      if (!userFound)
      {
          _log.error('Error at Validating Credentials, username: ' + username);
          return res.status(404).send({
              errorCode: EnumErrors.ERROR_USER_NOT_FOUND,
              errorMessage: 'ERROR_USER_NOT_FOUND'
          });
      }

      // Validación de password
      let matchPassword = false;
      let token = '';

      try {
          matchPassword = await bcrypt.compare(password, userFound.password);
      } catch (err) {
          _log.error('Bcrypt compare Failed, Err: ' + err);
      }

      if (matchPassword) {

          token = jwt.sign({uuid_user: userFound.uuid_user}, key, { expiresIn });
          _log.info("Token: " + token);

          _log.info('SUCCESS AT /login');
          let response = {
              user: userFound,
              token
          };
          return res.status(200).send(response);

      } else {
          _log.error('Password does not Match!');
          return res.status(404).send({
              errorCode: EnumErrors.ERROR_USER_NOT_FOUND,
              errorMessage: 'ERROR_USER_NOT_FOUND'
          });
      }

  } catch (err) {
      _log.error("Exception at /login, Err: " + err);
      res.status(500).send({
          errorCode: EnumErrors.ERROR_EXCEPTION,
          errorMessage: 'ERROR_EXCEPTION'
      })
  }

});


module.exports = router;