const db = require("../models");
const User = db.user;

checkEmailExistance = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.userEmail
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "Email not found." });
    }
    res.locals.user = user.toJSON();
    next();
  });
};

const verifyResetPassword = {
  checkEmailExistance: checkEmailExistance
};
module.exports = verifyResetPassword;