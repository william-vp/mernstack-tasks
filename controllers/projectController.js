const Project = require('../models/Project');
const {validationResult} = require('express-validator');

exports.createProject = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        //crear nuevo proyecto
        let project = new Project(req.body);
        project.created_by = req.user.id;
        project.save();
        res.json(project)
    } catch (e) {
        console.log(e);
        return res.status(400).json({msg: "Ha ocurrido un error inesperado"});
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({created_by: req.user.id})
            .sort({created_at: -1});
        res.json({projects});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error inesperado.")
    }
}

exports.updateProject = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {name} = req.body;
    const newProject = req.body;
    if (name) {
        newProject.name = name;
    }

    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send("El proyecto no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        project = await Project.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: newProject},
            {new: true}
        );

        res.json({project});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error inesperado.")
    }
}

exports.deleteProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send("El proyecto no existe");
        }

        if (project.created_by.toString() !== req.user.id) {
            return res.status(401).send("Usuario no autorizado");
        }

        await Project.findOneAndRemove({_id: req.params.id});
        res.json({msg: "Proyecto eliminado correctamenete"});
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocurrió un error Inesperado")
    }
}