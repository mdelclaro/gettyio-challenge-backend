const express = require("express");
const { body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

// POST /auth/signin
router.post(
  "/signin",
  [
    body("email")
      .isEmail()
      .not()
      .isEmpty(),
    body("password")
      .isLength({ min: 6 })
      .not()
      .isEmpty()
  ],
  authController.login
);

// POST /auth/refreshToken
router.post(
  "/refreshToken",
  [
    body("refreshToken")
      .not()
      .isEmpty()
  ],
  authController.refreshToken
);

module.exports = router;
