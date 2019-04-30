const { validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const errorHandler = require("../utils/error-handler");

// Create User (Signup)
exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      error = errorHandler.createError("Validation Failed.", 422, errors);
      throw error;
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);

    const hasUser = await User.findOne({ email });
    if (hasUser) {
      error = errorHandler.createError("Email already taken.", 422);
      throw error;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    const result = await user.save();
    res.status(201).json({
      _id: result._id,
      email: result.email
    });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
