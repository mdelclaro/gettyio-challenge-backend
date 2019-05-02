const express = require("express");
const { body, param } = require("express-validator/check");

const projectController = require("../controllers/project");
const auth = require("../middlewares/auth");
const router = express.Router();

// GET /projects
router.get("/", auth, projectController.getProjects);

// GET /projects/:idProject
router.get("/:idProject", auth, projectController.getProject);

// POST /projects
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 4 }),
    body("content")
      .trim()
      .isLength({ min: 10 })
  ],
  auth,
  projectController.createProject
);

// PUT /projects/:idProject
router.put(
  "/:idProject",
  [
    param("idProject")
      .not()
      .isEmpty(),
    body("title")
      .trim()
      .isLength({ min: 4 })
      .optional(),
    body("content")
      .trim()
      .isLength({ min: 10 })
      .optional()
  ],
  auth,
  projectController.updateProject
);

// DELETE /tools/:idProject
router.delete(
  "/:idProject",
  [
    param("idProject")
      .not()
      .isEmpty()
  ],
  auth,
  projectController.deleteProject
);

module.exports = router;
