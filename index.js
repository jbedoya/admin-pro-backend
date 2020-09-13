
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor Express
const app = express();

// configura CORS
app.use( cors() );

// mean_user
// VZ7eBj6rMm99vBZo

// Base de datos
dbConnection();

// console.log( process.env );

// rutas
app.get('/', (req, res) => {
  res.json({
      ok: true,
      msg: 'Hola Mundo 2'
  });
});

app.listen(process.env.PORT, ()=> {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});