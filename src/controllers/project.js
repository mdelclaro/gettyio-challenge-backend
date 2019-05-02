const { validationResult } = require("express-validator/check");
const ObjectId = require("mongoose").Types.ObjectId;

const errorHandler = require("../utils/error-handler");
const Project = require("../models/project");

// GET /projects
exports.getProjects = async (req, res, next) => {
  try {
    const clientId = req.userId;
    const projects = await Project.find({
      createdBy: clientId
    }).populate("createdBy");
    if (!projects || projects.length <= 0) {
      const error = errorHandler.createError("No project found.", 404);
      throw error;
    }

    res.status(200).json(projects);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// GET /projects/:idProject
exports.getProject = async (req, res, next) => {
  try {
    const idProject = req.params.idProject;

    if (!ObjectId.isValid(idProject)) {
      const error = errorHandler.createError("Invalid ID.", 422);
      throw error;
    }
    const project = await Project.findById(idProject).populate("createdBy");
    if (!project) {
      error = errorHandler.createError("No project found.", 404);
      throw error;
    }

    res.status(200).json(project);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// POST /projects
exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError(
        "Invalid parameters.",
        422,
        errors
      );
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    // const createdBy = req.body.createdBy;
    const createdBy = req.userId;

    const project = new Project({
      title,
      content,
      createdBy
    });

    await project.save();
    res.status(201).json(project);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// PUT /projects/:idProject
exports.updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError(
        "Invalid parameters.",
        422,
        errors
      );
      throw error;
    }

    const idProject = req.params.idProject;
    if (!ObjectId.isValid(idProject)) {
      const error = errorHandler.createError("Invalid ID.", 422);
      throw error;
    }

    const project = await Project.findById(idProject);

    if (!project) {
      const error = errorHandler.createError("No project found.", 404);
      throw error;
    }

    if (project.createdBy.toString() !== req.userId) {
      const error = errorHandler.createError("Not authorized.", 401);
      throw error;
    }

    project.set(req.body);
    await project.save();
    res.status(200).json(project);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

// DELETE /projects/:idFerrmanta
exports.deleteProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError(
        "Invalid parameters.",
        422,
        errors
      );
      throw error;
    }

    const idProject = req.params.idProject;
    if (!ObjectId.isValid(idProject)) {
      const error = errorHandler.createError("Invalid ID.", 422);
      throw error;
    }

    const project = await Project.findById(idProject);
    if (!project) {
      const error = errorHandler.createError("Project not found.", 404);
      throw error;
    }

    if (project.createdBy.toString() !== req.userId) {
      const error = errorHandler.createError("Not authorized.", 401);
      throw error;
    }

    await Project.findOneAndDelete(idProject);
    res.status(200).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
