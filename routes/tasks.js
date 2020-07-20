const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

router.post('/', [
    check('name', 'El nombre de la tarea es obligatioria').not().isEmpty(),
    check('projectId', 'El proyecto es obligatiorio').not().isEmpty(),
], auth, taskController.createTask);

router.get('/', auth, taskController.getTasks);

router.put('/:id', [
    check('name', 'El nombre de la tarea es obligatioria').not().isEmpty(),
], auth, taskController.updateTask);

router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;