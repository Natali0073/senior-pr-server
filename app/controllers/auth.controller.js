const db = require("../models");
const { authJwt } = require("../middleware");
const User = db.user;
var bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

exports.register = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.email === process.env.DEFAULT_EMAIL ? 'admin' : 'user',
    personalKey: uuidv4()
  })
    .then(user => {
      try {
        authJwt.generateToken(res, user.id, user.email);

        res.status(200).send({
          id: user.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: user.email
        });
      } catch (error) {
        res.status(500).send({ message: err.message });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Credentials not found!"
        });
      }
      try {
        authJwt.generateToken(res, user.id, user.email);

        res.status(200).send({
          avatar: req.body.avatar,
          createdAt: req.body.createdAt,
          email: req.body.email,
          firstName: req.body.firstName,
          id: user.id,
          lastName: req.body.lastName,
          role: req.body.role,
          updatedAt: req.body.updatedAt,
        });
      } catch (error) {
        res.status(500).send({ message: err.message });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
};

exports.resetPassword = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const newPassword = bcrypt.hashSync(req.body.password, 8);
      user.update({ password: newPassword, personalKey: crypto.randomUUID()})
        .then(user => {
          res.send({ message: "Password was reset successfully!" });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.changePassword = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const oldPasswordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );
    
    if (!oldPasswordIsValid) {
      res.status(400).send({ message: "Old password is invalid" });
      return;
    } 
    const newPassword = bcrypt.hashSync(req.body.password, 8);
    user.update({ password: newPassword })
      .then(user => {
        res.status(200).send({ message: "Password was updated successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}