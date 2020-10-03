const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if ( ! req.files ) {
        return res.status(400)
        .json({
            ok:false,
            err:{
                message: 'No se ha encontrado ningún archivo'
            }

        });
      }

      // Validar tipo
      let tiposValidos = ['productos', 'usuarios'];

      if (tiposValidos.indexOf(tipo) <0 ){
        return res.status(400)
        .json({
            ok:false,
            err:{
                message: 'Los tipos permitidos son: ' + tiposValidos.join(' ')
            }

        });
      }

      let archivo = req.files.archivo;
      let nombreCortado = archivo.name.split('.');
      let extension = nombreCortado[nombreCortado.length-1];

      // Extensiones permitidas
      let extValidas = ['png','jpg','gif','jpeg'];

      if (extValidas.indexOf(extension) < 0 ){
          return res.status(400).json({
              ok:false,
              err:{
                  message: 'Extensión no permitida',
              }
          })
      }

      // Cambiar nombre del archivo
      let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

      archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{
        if (err)
          return res.status(500)
            .json({
                ok:false,
                err
            });

        // La imagen ya esta cargada
        if ( tipo === 'usuarios' ){
            imageUsuario(id, res, nombreArchivo);
        } else {
            imageProducto(id, res, nombreArchivo);
        }

        // res.json({
        //     ok:true,
        //     message: 'Imagen subida correctamente',
        // })
      });
});

function imageProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            BorrarArchivo(nombreArchivo, 'productos');

            return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
        }

        if ( ! productoBD ){
            BorrarArchivo(nombreArchivo, 'productos');

            return res.status(400)
            .json({
                ok: false,
                message: "El usuario no existe"
            })
        }

        BorrarArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;
        productoBD.save( (err, producto) => {
            res.json({
                ok: true,
                producto,
                img: nombreArchivo,
            })
        });


    });
}


function imageUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioBD) =>{
        if (err) {

            BorrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
        }

        if ( !usuarioBD) {

            BorrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400)
            .json({
                ok: false,
                message: "El usuario no existe"
            })
        }

        BorrarArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save( (err, usuario) => {
            res.json({
                ok: true,
                usuario,
                img: nombreArchivo,
            })
        });


    });

}

function BorrarArchivo(nombreImagen, tipo){
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;