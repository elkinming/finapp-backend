//NPM modules load
const express = require('express');
const cors = require('cors');


//Variables
const app = express();
const server = require('http').createServer(app);

// Cargar Routers

// Activando CORS headers
app.use(cors());

// Activando JSON en Body
app.use(express.json());

// Agregar routes a aplicacion


module.exports = server;
