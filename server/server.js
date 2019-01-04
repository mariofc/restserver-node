require('./config/config.js');

const express = require('express');
var bodyParser = require('body-parser');


var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res){
    res.send('get Usuario');
});

app.post('/usuario', function(req, res){
    let body = req.body;

    if (body.nombre === undefined){
        res.status(400).json({
            ok : false,
            mensaje : 'El nombre es necesario'
        });
    }else{
        res.json({
            body
        });
    }


});

app.put('/usuario/:id', function(req, res){

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res){
    res.send('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
});