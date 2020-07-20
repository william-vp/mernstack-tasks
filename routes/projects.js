const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");

// api/proyectos CREATE POST
router.post('/', [
    check('name', 'El nombre de proyecto es obligatiorio').not().isEmpty(),
], auth, projectController.createProject);

router.get('/', auth, projectController.getProjects);

router.put('/:id', [
    check('name', 'El nombre de proyecto es obligatiorio').not().isEmpty(),
], auth, projectController.updateProject);

router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;