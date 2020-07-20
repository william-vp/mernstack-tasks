const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //obtener token de header
    const token = req.header('x-auth-token');

    //validar que exista token
    if (!token) {
        return res.status(401).json({msg: "no token"});
    }

    //validar token
    try {
        const cifrado= jwt.verify(token, process.env.SECRET);
        req.user= cifrado.user;
        next();
    } catch (e) {
        res.status(401).json({msg: "token inválido"});
    }
}