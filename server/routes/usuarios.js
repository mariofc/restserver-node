const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

var app = express();

app.get('/usuario', verificaToken, function(req, res){

    let desde = req.query.desde;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);

    let filtroEstado = {
        estado : true
    }

    Usuario.find(filtroEstado)
            .limit(limite)
            .skip(desde)
            .exec( (err, usuarios) => {
                if (err){
                    return res.status(400).json({
                        ok : false,
                        err
                    });
                };

        Usuario.count(filtroEstado, (err, conteo) => {
            res.json({
                ok : true,
                usuarios,
                cantidad : conteo
            });
            
        });


    });  
});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res){
    let body = req.body;

    let usuario = new Usuario({
        nombre : body.nombre,
        email:  body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) =>{
        if (err){
            return res.status(400).json({
                ok : false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok : true,
            usuario : usuarioDB
        });

    } );


    //Ejemplo 1
    /*if (body.nombre === undefined){
        res.status(400).json({
            ok : false,
            mensaje : 'El nombre es necesario'
        });
    }else{
        res.json({
            body
        });
    }*/


});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res){

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','password','role','estado']);
    //let body = req.body;
    

    Usuario.findByIdAndUpdate(id, body, {new : true}, (err, usuarioDB)=>{
        if (err){
            return res.status(400).json({
                ok : false,
                err
            });
        }

        res.json({
            ok : true,
            usuario : usuarioDB
        });
    })

    // let id = req.params.id;
    // res.json({
    //     id
    // });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res){

    let id = req.params.id;

    let cambiaEstado = {
        estado : false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new : true}, (err, usuarioBorrado) => {
        if (err){
            return res.status(400).json({
                ok : false,
                err
            });
        }

        if (usuarioBorrado === null){
            return res.status(400).json({
                ok : false,
                err : {
                    message : 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok : true,
            usuario : usuarioBorrado
        });
    });

});

module.exports = app;