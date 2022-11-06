var bcrypt = require("bcryptjs");
const {OAuth2Client} = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { authJwt } = require("../middleware");
const db = require("../models");
const User = db.user;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.register = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
    personalKey: uuidv4()
  })
    .then(user => {
      try {
        authJwt.generateToken(res, user.id, user.personalKey, user.email);

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
  if (req.body.password === null) {
    return res.status(404).send({ message: "No password" });
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.isBanned) {
        return res.status(403).send({
          message: "User is banned",
          reason: 'userBanned'
        });
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
        authJwt.generateToken(res, user.id, user.personalKey, user.email);

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
      user.update({ password: newPassword, personalKey: uuidv4() })
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

exports.loginWithGoogle = (req, res) => {
  client.verifyIdToken({
    idToken: req.body.credential,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  .then(async ticket => {
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    const user = await User.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        firstName: given_name,
        lastName: family_name,
        email: email,
        password: null,
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        personalKey: uuidv4()
      }
    });

    if (user[1]) {
      return user[0].dataValues;
    }

    return user[0];
  })
  .then(user => {
    try {
      authJwt.generateToken(res, user.id, user.personalKey, user.email);
      return res.redirect('/');
    } catch (error) {
      res.status(500).send({ message: err.message });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

exports.loginWithFacebook = (req, res) => {
  client.verifyIdToken({
    idToken: req.body.credential,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  .then(async ticket => {
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    const user = await User.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        firstName: given_name,
        lastName: family_name,
        email: email,
        password: null,
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        personalKey: uuidv4()
      }
    });

    if (user[1]) {
      return user[0].dataValues;
    }

    return user[0];
  })
  .then(user => {
    try {
      authJwt.generateToken(res, user.id, user.personalKey, user.email);
      return res.redirect('/');
    } catch (error) {
      res.status(500).send({ message: err.message });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

async function getFacebookUserData(access_token) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accesstoken,
    },
  });
  console.log(data); // { id, email, first_name, last_name }
  return data;
};