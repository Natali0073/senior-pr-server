const db = require("../models");
const User = db.user;

exports.users = (req, res) => {
  User.findAll().then(users => {
    res.status(200).send(users);
  })
};
exports.userById = (req, res) => {
  console.log(req.params.id);
  User.findOne({
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