const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyResetPassword = require("./verifyResetPassword");
const multerMiddleware = require("./multer");
module.exports = {
  authJwt,
  verifySignUp,
  verifyResetPassword,
  multerMiddleware
};