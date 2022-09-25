const { Op } = require("sequelize");
const db = require("../models");
const uploadController = require("./uploads.controller");
const User = db.user;

exports.users = (req, res) => {
  User.findAll({
    where: {
      id: {
        [Op.ne]: req.userId
      }
    }
  }).then(users => {
    const response = users.map(user => returnUserData(user));
    res.status(200).send(response);
  })
};
exports.userById = (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(returnUserData(user));
  })
};

exports.currentUser = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(returnUserData(user));
  })
};

exports.updatePersonalInfo = (req, res, next) => {
  User.findOne({
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
      res.send(returnUserData(user));
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

const returnUserData = (user) => ({
  avatar: user.avatar,
  createdAt: user.createdAt,
  email: user.email,
  firstName: user.firstName,
  id: user.id,
  lastName: user.lastName,
  role: user.role,
  updatedAt: user.updatedAt,
});
