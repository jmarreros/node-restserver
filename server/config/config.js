//========
// Puerto
//========
process.env.PORT = process.env.PORT || 3000;

//=========
// Entorno
//=========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Fecha de expiración token
//===========================

process.env.CADUCIDAD_TOKEN = 60*60*24*30;


//========================
// Seed de autenticación
//========================

process.env.SEED = process.env.SEED || 'esdesarrollo';

//================
// Base de datos
//================

let urlBD;

if ( process.env.NODE_ENV == 'dev' ){
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URL;
}

process.env.URLDB = urlBD;
