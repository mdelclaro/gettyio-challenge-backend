const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error-handler");
const { publicKey } = require("../utils/config");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = errorHandler.createError("Not authenticated.", 401);
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, publicKey, { algorithms: "RS256" });
  } catch (err) {
    if (!err.message === "jwt expired") {
      err.message = "Invalid Token.";
    }
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = errorHandler.createError("Not authenticated.", 401);
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
