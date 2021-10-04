const jwt = require("jsonwebtoken");
const User = require("../models/User");
const roles = require("./roles");

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    let error = new Error("Unauthorized");
    error.status = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      let error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }

    req.userid == decoded.id;
    next();
  });
};

const checkRoles = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    let error = new Error("Unauthorized");
    error.status = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      let error = new Error("Unauthorized");
      error.status = 401;
      return next(error);
    }

    let user = await User.findById(decoded.id);
    if (user.role === roles.ADMIN) {
      next();
    } else {
      let error = new Error("You are not authorized");
      error.status = 403;
      next(error);
    }
  });
};

module.exports = { verifyJWT, checkRoles };
