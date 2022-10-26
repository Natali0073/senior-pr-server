const { Op } = require("sequelize");
const db = require("../models");
const User = db.user;
const sequelize = db.sequelize;

const excludedFromUser = ['password', 'personalKey'];

exports.bannedUsers = (req, res) => {
  if (req.isAdmin === false) { 
    return res.status(403).send();
  }

  const { name } = req.query;

  User.findAll({
    attributes: { exclude: excludedFromUser },
    where: {
      [Op.and]: [
        {
          id: { [Op.ne]: req.userId }
        },
        {
          isBanned: true 
        },
        sequelize.where(sequelize.fn(
          'concat', 
          sequelize.col('firstName'), 
          ' ', 
          sequelize.col('lastName'),
          ' ', 
          sequelize.col('firstName')
          ), {
            [Op.like]: `%${name || ''}%`
          })
      ]
    }
  }).then(users => {
    res.status(200).send(users);
  })
};

exports.ban = (req, res, next) => {
  if (req.isAdmin === false) { 
    return res.status(403).send();
  }
  
  User.findOne({
    attributes: { exclude: excludedFromUser },
    where: {
      id: req.body.userId
    }
  }).then(async (user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    updateUser(req, res, user);
  });
};

const updateUser = (req, res, user) => {
  user.update({
    isBanned: req.body.isBanned
  })
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}