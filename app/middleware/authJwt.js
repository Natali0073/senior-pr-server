const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const generateToken = (res, id, key, email) => {
  const expiration = process.env.DB_ENV === 'development' ? 100 : 604800000;
  const token = jwt.sign({ id, email }, key, {
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
  const id = jwt.decode(token).id;
  User.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: "No user found"
      });
    }
    return user.personalKey;
  }).then(key => {
    jwt.verify(token, key, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Session expired!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  });
};

const generateResetPasswordToken = (id, key) => {
  const expiresIn = process.env.DB_ENV === 'development' ? '5m' : '30m';
  const token = jwt.sign({ id }, process.env.JWT_RESET_SECRET + key, {
    expiresIn: expiresIn,
  });
  return { token, expiresIn };
};

const verifyResetPasswordToken = (req, res, next) => {
  const token = req.body.token || '';
  if (!token) {
    return res.status(401).send({
      message: "Session expired!"
    });
  }

  const id = jwt.decode(token).id;

  User.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: "No user found"
      });
    }
    return user.personalKey;
  }).then(key => {
    jwt.verify(token, process.env.JWT_RESET_SECRET + key, (err, decoded) => {
      console.log(err);
      console.log(decoded);
      if (err) {
        return res.status(401).send({
          message: "Session expired!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  });
};

const authJwt = {
  generateToken: generateToken,
  verifyTokenCookies: verifyTokenCookies,
  generateResetPasswordToken: generateResetPasswordToken,
  verifyResetPasswordToken: verifyResetPasswordToken
};
module.exports = authJwt;