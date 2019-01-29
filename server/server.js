require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

var bodyParser = require('body-parser');


var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err,res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});