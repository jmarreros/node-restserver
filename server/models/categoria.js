const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    titulo:{
        type: String,
        unique: true,
        required: [true,'El título es necesario']
    },
    descripcion:{
        type:String,
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único',
});

module.exports = mongoose.model('Categoria', categoriaSchema);