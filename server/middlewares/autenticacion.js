const jwt = require('jsonwebtoken');

//=================
// Verificar Token
//=================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok:false,
                err: {
                    message:'Token no válido',
                }
            })
        }

        req.usuario = decoded.usuario;

        next();
    });

    // console.log(token);

}

//=================
// Verificar Token
//=================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if ( usuario.role != 'ADMIN_ROL'){
        return res.status(401).json({
            ok:false,
            err: {
                message:'El usario no tiene suficientes privilegios',
            }
        })
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
};