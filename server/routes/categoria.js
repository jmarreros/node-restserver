const express = require('express');
let  {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');
let Usuario = require('../models/usuario');

// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res) => {
    // Categoria.find({}, (err, categorias) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok:false,
    //             err,
    //         });
    //     }
    //     res.json({
    //         ok:true,
    //         categorias
    //     })
    // })
    Categoria.find({})
        .sort('titulo')
        .populate('usuario', 'nombre email')
        .exec ( (err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err,
                });
            }
            res.json({
                ok:true,
                categorias
            })
        });
});

// ======================
// Crear nueva categoría
// ======================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body
    Categoria.create({
        titulo:body.titulo,
        descripcion: body.description,
        usuario: req.usuario._id,
    }, function(err, category){
        if (err){
            return res.status(500).json({
                ok:false,
                err,
            });
        }

        if (!category){
            return res.status(400).json({
                ok:false,
                err,
            });
        }

        res.json({
            ok:true,
            category
        })
    })

});


// =============================
// Mostrar una categoría por ID
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, category) =>{
        if (err){
            return res.status(500).json({
                ok:false,
                err,
            })
        }

        if (!category){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El Id de la categoría no es correcto'
                }
            });
        }
        res.json({
            ok:true,
            category
        })
    });
});


// =========================
// Actualizar una categoría
// =========================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, {
        titulo: body.titulo,
        descripcion: body.descripcion
    }, (err, category) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err,
            })
        }
        res.json({
            ok:true,
            category
        })
    })
});

// =============================
// Borrar una categoría por ID
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findOneAndDelete(id, (err, category) => {
        if (err){
            return res.status(400).json({
                ok:false,
                err,
            })
        }
        res.json({
            ok:true,
            category
        });
    });

});

module.exports = app;
