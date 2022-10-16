const { Op } = require("sequelize");
const db = require("../models");
const uploadController = require("./uploads.controller");
const User = db.user;

const excludedFromUser = ['password', 'personalKey'];

exports.users = (req, res) => {
  User.findAll({
    attributes: { exclude: excludedFromUser },
    where: {
      id: {
        [Op.ne]: req.userId
      }
    }
  }).then(users => {
    res.status(200).send(users);
  })
};
exports.userById = (req, res) => {
  User.findOne({
    attributes: { exclude: excludedFromUser },
    where: {
      id: req.params.id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(user);
  })
};

exports.currentUser = (req, res) => {
  User.findOne({
    attributes: { exclude: excludedFromUser },
    where: {
      id: req.userId
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(user);
  })
};

exports.updatePersonalInfo = (req, res, next) => {
  User.findOne({
    attributes: { exclude: excludedFromUser },
    where: {
      id: req.userId
    }
  }).then(async (user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    if (req.file) {
      try {
        const uploadResponse = await uploadController.uploadFile(req, 'users-avatars', res, next)
        updateCurrentUser(req, res, user, uploadResponse);

      } catch (error) {
        res.status(400).send({ message: err });
      }
    } else {
      updateCurrentUser(req, res, user);
    }
  })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const updateCurrentUser = (req, res, user, uploadResponse) => {
  user.update({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: uploadResponse ? uploadResponse.Location : user.avatar
  })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}
