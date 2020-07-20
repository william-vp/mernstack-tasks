const Task = require('../models/Task');
const Project = require('../models/Project');
const {validationResult} = require('express-validator');

exports.createTask = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {projectId} = req.body;
    try {
        let project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send("El proyecto seleccionado ya no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        //crear nueva tarea
        let task = new Task(req.body);
        task.save();
        res.json(task);
    } catch (e) {
        console.log(e);
        return res.status(400).json({msg: "Ha ocurrido un error inesperado"});
    }
}

exports.getTasks = async (req, res) => {
    try {
        const { projectId } = req.query;
        let project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send("El proyecto seleccionado ya no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        const tasks = await Task.find({projectId: project})
            .sort({_id: -1});
        res.json({tasks});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error inesperado.")
    }
}

exports.updateTask = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {name, status, projectId} = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send("La Tarea no existe");
        }

        let project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send("El proyecto seleccionado ya no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        const newTask = {};
        newTask.name = name;
        newTask.status = status;

        task = await Task.findOneAndUpdate(
            {_id: req.params.id},
            newTask,
            {new: true}
        );
        res.json({task});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error inesperado.")
    }
}

exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send("La tarea ya no existe");
        }

        let project = await Project.findById(task.projectId);
        if (!project) {
            return res.status(404).send("El proyecto seleccionado ya no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        await Task.findOneAndRemove({_id: req.params.id});
        res.json({msg: "Tarea eliminada correctamenete"});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error Inesperado")
    }
}