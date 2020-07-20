const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {check} = require('express-validator');

// api/users
router.post('/', [
    check('name','El nombre es obligatiorio').not().isEmpty(),
    check('email','El correo electrónico es inválido').isEmail(),
    check('password','La contraseña no es valida. Debe tener 6 caracteres como mínimo.').isLength({min: 6}),
], userController.createUser);
module.exports = router;