const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //extraer info de request
    const {email, password} = req.body;

    try {
        //validar user exists
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({msg: "El usuario no existe"});
        }

        //validar password
        const password_validation= await bcryptjs.compare(password, user.password);
        if (!password_validation){
            return res.status(400).json({msg: "La contraseña es incorrecta"});
        }

        //loggin y crear y firmar JWT
        const payload = {
            user: {
                id: user.id
            }
        };
        //firmar JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            //mensaje confirmacion
            res.json({token});
        });

    } catch (e) {
        console.log(e);
    }

}

//get user auth
exports.getUserAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: "Ocurrio un error."});
    }
}
