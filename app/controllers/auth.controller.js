const db = require("../models");
const { authJwt } = require("../middleware");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      const resultDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
      res.send({ message: "User was registered successfully!", data: resultDto });
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
          message: "Invalid Password!"
        });
      }
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
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = async (req, res) => {
  return res
  .clearCookie('token')
  .status(200)
};