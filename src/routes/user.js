const express = require("express");
const { body } = require("express-validator/check");

const userController = require("../controllers/user");

const router = express.Router();

// POST /signup
router.post("/", [
  body("firstName")
    .not()
    .isEmpty(),
  body("lastName")
    .not()
    .isEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  userController.createUser
]);

module.exports = router;
