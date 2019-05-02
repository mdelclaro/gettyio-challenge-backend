const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const {
  privateKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey
} = require("../utils/config");

const User = require("../models/user");
const errorHandler = require("../utils/error-handler");

exports.login = async (req, res, next) => {
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

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = errorHandler.createError("Email not found.", 401);
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = errorHandler.createError("Invalid password.", 401);
      throw error;
    }

    const userId = user._id.toString();

    const token = await jwt.sign(
      {
        username: `${user.firstName} ${user.lastName}`,
        email,
        userId
      },
      privateKey,
      { expiresIn: "1h", algorithm: "RS256" }
    );
    const refreshToken = await jwt.sign(
      { email, token },
      refreshTokenPrivateKey,
      {
        algorithm: "RS256"
      }
    );
    let expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res.status(200).json({
      token,
      refreshToken,
      expiryDate: expiryDate.toString(),
      userId,
      initials: user.firstName[0] + user.lastName[0]
    });
    return; // return the promise for testing
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err; // return the promise for testing
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const requestToken = req.body.token;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errorHandler.createError(
        "Invalid parameters.",
        422,
        errors
      );
      throw error;
    }

    const refreshToken = req.body.refreshToken;
    let decodedToken;

    try {
      decodedToken = await jwt.verify(refreshToken, refreshTokenPublicKey);
      if (!decodedToken) throw new Error();
    } catch (err) {
      err.message = "Invalid Token.";
      err.statusCode = 401;
      throw err;
    }

    if (requestToken != decodedToken.token) {
      const error = errorHandler.createError(
        "Invalid refresh token.",
        401,
        errors
      );
      throw error;
    }
    const email = decodedToken.email;
    const user = await User.findOne({ email });

    if (!user) {
      const error = errorHandler.createError("Invalid Token.", 500);
      throw error;
    }

    const userId = user._id.toString();

    const token = await jwt.sign(
      {
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userId
      },
      privateKey,
      { expiresIn: "1h", algorithm: "RS256" }
    );

    const newRefreshToken = await jwt.sign(
      { email, token },
      refreshTokenPrivateKey,
      {
        algorithm: "RS256"
      }
    );
    let expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res.status(200).json({
      token,
      refreshToken: newRefreshToken,
      expiryDate: expiryDate.toString(),
      userId,
      initials: user.firstName[0] + user.lastName[0]
    });
    return; // return the promise for testing
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err; // return the promise for testing
  }
};
