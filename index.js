
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor Express
const app = express();

// configura CORS
app.use( cors() );

// Lectura y parseo de body
app.use( express.json() );

// mean_user
// VZ7eBj6rMm99vBZo

// Base de datos
dbConnection();

// console.log( process.env );

// rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/todo', require('./routes/busquedas') );
app.use( '/api/upload', require('./routes/uploads') );
app.use( '/api/login', require('./routes/auth') );


app.listen(process.env.PORT, ()=> {
    console.log('Servidor corriendo en puerto '+ process.env.PORT);
});