const jwt = require("jsonwebtoken");
const db = require("../models");

const generateToken = (res, id, email) => {
  const expiration = process.env.DB_ENV === 'development' ? 100 : 604800000;
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.DB_ENV === 'development' ? '1d' : '7d',
  });
  res.cookie('token', token);
};

const verifyTokenCookies = (req, res, next) => {
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(403).send({
      message: "Need to Login!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.clearCookie("token").status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  generateToken: generateToken,
  verifyTokenCookies: verifyTokenCookies,
};
module.exports = authJwt;