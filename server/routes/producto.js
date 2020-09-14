const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// Crear un nuevo producto
app.post('/productos/', verificaToken, (req, res) => {
    let body = req.body;

    Producto.create({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
        }, (err, producto) => {
            if (err){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }

            if (!producto){
                return res.status(400).json({
                    ok:false,
                    err,
                });
            }

            res.status(201).json({
                ok:true,
                producto
            })
        }
    )
});


// Obtener todos los productos
app.get('/productos', (req, res) => {
    // --> Los parámetros de url se obtienen con req.query
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true})
        // .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'titulo descripcion')
        .exec( (err, producto) => {
            if (err){
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }
            res.json({
                ok: true,
                producto
            })
        });
});

//Obtener un producto por id
app.get('/productos/:id', (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'titulo descripcion')
        .exec((err, producto) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err,
            })
        }
        if (!producto){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El Id del producto no es correcto'
                }
            });
        }
        if ( ! producto.disponible ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El producto no existe'
                }
            });
        }
        res.json({
            ok:true,
            producto
        })
    });

});

// Actualizar el producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    }, (err, producto) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err,
            })
        }
        res.json({
            ok:true,
            producto
        })
    });
});

// Borrar el producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {
        disponible: false
    }, (err, producto) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err,
            })
        }
        res.json({
            ok:true,
            producto
        })
    });

});

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec( (err, productos) => {
            if (err){
                return res.status(400).json({
                    ok:false,
                    err,
                })
            }
            res.json({
                ok:true,
                productos
            })
        });
});

module.exports = app;