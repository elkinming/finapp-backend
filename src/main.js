//NPM modules load
const express = require('express');
const cors = require('cors');


//Variables
const app = express();
const server = require('http').createServer(app);

// Cargar Routers
const login = require('./routes/login');
const userPost = require('./routes/user-post');
const budgetListGet = require('./routes/budget-list-get');
const budgetPost = require('./routes/budget-post');
const transactionListGet = require('./routes/transaction-list-get');
const transactionPost = require('./routes/transaction-post');

// Activando CORS headers
app.use(cors());

// Activando JSON en Body
app.use(express.json());

// Agregar routes a aplicacion
app.use(login);
app.use(userPost);
app.use(budgetListGet);
app.use(budgetPost);
app.use(transactionListGet);
app.use(transactionPost);

module.exports = server;
