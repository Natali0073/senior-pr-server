const { authJwt, multerMiddleware } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/admin/banned", [authJwt.verifyTokenCookies], controller.bannedUsers);
  app.post('/api/admin/ban',
    [authJwt.verifyTokenCookies],
    controller.ban)
};