const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //extraer info
    const {email, password} = req.body;

    try {
        //revisar registro
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "El correo electrónico ingresado ya esta registrado"});
        }

        //instanciar user
        user = new User(req.body);
        //hash password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        //save user
        await user.save();

        //crear y firmar JWT
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

        //response
        //res.json({msg: "Usuario creado correctamente."});
    } catch (e) {
        console.log(e);
        res.status(400).send("hubo un error");
    }
}