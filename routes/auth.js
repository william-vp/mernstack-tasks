const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController= require('../controllers/authController');
const auth = require("../middleware/auth");

// api/auth login
router.post('/', [
    check('email','El correo electrónico es inválido').isEmail()
], authController.authUser);

//get user auth
router.get('/', auth, authController.getUserAuth);
module.exports = router;